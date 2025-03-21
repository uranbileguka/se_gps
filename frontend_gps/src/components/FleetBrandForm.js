import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import { createBrand } from "../api"; // Adjust path as needed

const FleetBrandForm = () => {
	const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
	const [successOpen, setSuccessOpen] = useState(false); // Snackbar state

	const onSubmit = async (data) => {
		console.log("Submitting:", data);

		try {
			await createBrand(data.brandName);
			reset();
			setSuccessOpen(true); // Show success snackbar
		} catch (error) {
			console.error("Error creating brand:", error);

			const message =
				error?.name?.[0] ||
				error?.message ||
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
				<form onSubmit={handleSubmit(onSubmit)} noValidate>
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

			{/* Success Snackbar */}
			<Snackbar
				open={successOpen}
				autoHideDuration={3000}
				onClose={() => setSuccessOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: '100%' }}>
					Brand successfully added!
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default FleetBrandForm;
