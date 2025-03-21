import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { createBrand } from "../api"; // adjust the path based on your project structure

const FleetBrandForm = () => {
	const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

	const onSubmit = async (data) => {
		console.log("Submitting:", data);
	
		try {
			await createBrand(data.brandName);
			console.log("Brand created successfully");
			reset(); // Clear the form
		} catch (error) {
			console.error("Error creating brand:", error);
	
			// Handle Django validation error (duplicate brand)
			const message =
				error?.name?.[0] || // e.g. "brand with this name already exists."
				error?.message ||   // fallback
				"Failed to create brand";
	
			setError("brandName", {
				type: "manual",
				message: message,
			});
		}
	};
	

	return (
		<Container maxWidth="sm">
			<Box sx={{ bgcolor: "#002855", color: "#fff", p: 3, borderRadius: 2, textAlign: "center" }}>
				<Typography variant="h5" gutterBottom>
					Fleet Brand Form
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					<TextField
						label="Brand Name"
						fullWidth
						margin="normal"
						{...register("brandName", { required: "Brand name is required" })}
						error={!!errors.brandName}
						helperText={errors.brandName?.message}
					/>

					<Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#f5b700", color: "#000" }}>
						Submit
					</Button>
				</form>
			</Box>
		</Container>
	);
};

export default FleetBrandForm;
