import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
	TextField,
	Button,
	Container,
	Typography,
	Box,
	Snackbar,
	Alert,
	Paper,
} from "@mui/material";
import { createBrand, updateBrand } from "../api";
import { useNavigate } from "react-router-dom"; // ✅ Import React Router

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
	const navigate = useNavigate(); 
	const onSubmit = async (data) => {
		try {
			if (editBrand) {
				await updateBrand(editBrand.id, data.brandName);
			} else {
				await createBrand(data.brandName);
			}
			setSuccessOpen(true);
			reset();
			// onSuccess();
			setTimeout(() => navigate("/brand"), 1500); // ✅ Redirect to Fleet List
			// Refresh list and hide form after update
		} catch (error) {
			setError("brandName", {
				type: "manual",
				message: error.name?.[0] || error.message || "Operation failed",
			});
		}
	};

	return (
		<Container maxWidth="sm">
			<Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: "#ffffff", color: "#333", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
				<Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
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
						sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
					/>

					<Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#1976d2", color: "#fff", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
						{editBrand ? "Update" : "Submit"}
					</Button>
				</form>
			</Paper>

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
