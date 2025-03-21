import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";

const FleetModelForm = () => {
	const { register, handleSubmit, formState: { errors }, watch } = useForm();

	const onSubmit = (data) => {
		console.log("Form Submitted:", data);
	};

	// Watch selected brand to filter car models dynamically
	const selectedBrand = watch("brand");

	// Car models based on selected brand
	const carModels = {
		Toyota: ["Corolla", "Camry", "Rav4", "Hilux"],
		Honda: ["Civic", "Accord", "CR-V", "Pilot"],
		Ford: ["Focus", "Mustang", "Escape", "F-150"],
		BMW: ["X3", "X5", "3 Series", "5 Series"],
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ bgcolor: "#002855", color: "#fff", p: 3, borderRadius: 2, textAlign: "center" }}>
				<Typography variant="h5" gutterBottom>
					Fleet Model Form
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Model name */}
					<TextField
						label="Fleet model name"
						fullWidth
						margin="normal"
						{...register("fleetNumber", { required: "Fleet number is required" })}
						error={!!errors.fleetNumber}
						helperText={errors.fleetNumber?.message}
					/>	
					{/* Brand */}
					<TextField
						select
						label="Brand"
						fullWidth
						margin="normal"
						disabled={!selectedBrand}
						{...register("model", {
							required: "Please select a model",
						})}
						error={!!errors.model}
						helperText={errors.model?.message}
					>
						{selectedBrand &&
							carModels[selectedBrand]?.map((model) => (
								<MenuItem key={model} value={model}>
									{model}
								</MenuItem>
							))}
					</TextField>

					<Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#f5b700", color: "#000" }}>
						Submit
					</Button>
				</form>
			</Box>
		</Container>
	);
};

export default FleetModelForm;
