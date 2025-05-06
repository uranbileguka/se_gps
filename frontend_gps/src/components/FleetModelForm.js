import React from "react"; 
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Typography, Paper } from "@mui/material";

const FleetModelForm = () => {
	const { register, handleSubmit, formState: { errors }, watch } = useForm();

	const onSubmit = (data) => {
		console.log("Form Submitted:", data);
	};

	// Watch selected brand to filter Fleet models dynamically
	const selectedBrand = watch("brand");

	// Fleet models based on selected brand
	const carModels = {
		Toyota: ["Corolla", "Camry", "Rav4", "Hilux"],
		Honda: ["Civic", "Accord", "CR-V", "Pilot"],
		Ford: ["Focus", "Mustang", "Escape", "F-150"],
		BMW: ["X3", "X5", "3 Series", "5 Series"],
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: "#ffffff", color: "#333", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
				<Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
					Fleet Model Form
				</Typography>
				<form onSubmit={handleSubmit(onSubmit)}>
					{/* Model name */}
					<TextField
						label="Fleet Model Name"
						fullWidth
						margin="normal"
						{...register("fleetNumber", { required: "Fleet number is required" })}
						error={!!errors.fleetNumber}
						helperText={errors.fleetNumber?.message}
						sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
					/>	

					{/* Brand */}
					<TextField
						select
						label="Brand"
						fullWidth
						margin="normal"
						{...register("brand", { required: "Please select a brand" })}
						error={!!errors.brand}
						helperText={errors.brand?.message}
						sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
					>
						{Object.keys(carModels).map((brand) => (
							<MenuItem key={brand} value={brand}>
								{brand}
							</MenuItem>
						))}
					</TextField>

					{/* Fleet model */}
					<TextField
						select
						label="Fleet model"
						fullWidth
						margin="normal"
						disabled={!selectedBrand}
						{...register("model", { required: "Please select a model" })}
						error={!!errors.model}
						helperText={errors.model?.message}
						sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
					>
						{selectedBrand &&
							carModels[selectedBrand]?.map((model) => (
								<MenuItem key={model} value={model}>
									{model}
								</MenuItem>
							))}
					</TextField>

					<Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#1976d2", color: "#fff", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
						Submit
					</Button>
				</form>
			</Paper>
		</Container>
	);
};

export default FleetModelForm;
