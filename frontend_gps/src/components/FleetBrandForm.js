import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	TextField,
	Button,
	Container,
	Typography,
	Box,
	Snackbar,
	Alert
} from "@mui/material";
import { createBrand, updateBrand } from "../api";

const FleetBrandForm = ({ editBrand, onSuccess }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		setError,
		setValue,
	} = useForm();

	const [successOpen, setSuccessOpen] = useState(false);

	// Populate form in edit mode
	useEffect(() => {
		if (editBrand) {
			setValue("brandName", editBrand.name);
		} else {
			reset();
		}
	}, [editBrand, reset, setValue]);

	const onSubmit = async (data) => {
		try {
			if (editBrand) {
				await updateBrand(editBrand.id, data.brandName);
			} else {
				await createBrand(data.brandName);
			}
			setSuccessOpen(true);
			reset();
			onSuccess(); // Refresh list and hide form after update
		} catch (error) {
			setError("brandName", {
				type: "manual",
				message: error.name?.[0] || error.message || "Operation failed",
			});
		}
	};

	return (
		<Container maxWidth="sm">
			<Box sx={{ bgcolor: "#002855", color: "#fff", p: 3, borderRadius: 2, textAlign: "center" }}>
				<Typography variant="h5" gutterBottom>
					{editBrand ? "Edit Brand" : "Add Brand"}
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
						{editBrand ? "Update" : "Submit"}
					</Button>
				</form>
			</Box>

			<Snackbar
				open={successOpen}
				autoHideDuration={3000}
				onClose={() => setSuccessOpen(false)}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: "100%" }}>
					{editBrand ? "Brand updated successfully!" : "Brand successfully added!"}
				</Alert>
			</Snackbar>
		</Container>
	);
};

export default FleetBrandForm;
