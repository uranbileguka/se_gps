import React, { useEffect, useState } from "react";
import { getBrandData, deleteBrand } from "../api";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	IconButton,
	Box,
	Snackbar,
	Alert,
	Button
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FleetBrandForm from "./FleetBrandForm";

const Brand = () => {
	const [brands, setBrands] = useState([]);
	const [editBrand, setEditBrand] = useState(null); // Track selected brand
	const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar for delete
	const [snackbarMessage, setSnackbarMessage] = useState(""); // Message for success

	const fetchData = async () => {
		try {
			const response = await getBrandData();
			setBrands(response.data);
		} catch (error) {
			console.error("Error fetching brand data:", error);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this brand?")) {
			try {
				await deleteBrand(id);
				setSnackbarMessage("Brand deleted successfully!");
				setSnackbarOpen(true);
				fetchData(); // Refresh table
				setEditBrand(null); // Hide form if deleting selected item
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	const handleCloseSnackbar = () => {
		setSnackbarOpen(false);
	};

	return (
		<Box>
			{/* Show the form only if editing a brand */}
			{editBrand && (
				<FleetBrandForm
					editBrand={editBrand}
					onSuccess={() => {
						fetchData(); // Refresh list
						setEditBrand(null); // Hide form after update
					}}
				/>
			)}

			<TableContainer component={Paper} sx={{ mt: 5, p: 3 }}>
				<Typography variant="h5" sx={{ mb: 2 }}>
					Brand List
				</Typography>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>ID</TableCell>
							<TableCell>Brand Name</TableCell>
							<TableCell align="right">Action</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{brands.map((item) => (
							<TableRow
								key={item.id}
								hover
								sx={{ cursor: "pointer" }}
								onClick={() => setEditBrand(item)} // Show form on row click
							>
								<TableCell>{item.id}</TableCell>
								<TableCell>{item.name}</TableCell>
								<TableCell align="right" onClick={(e) => e.stopPropagation()}>
									<IconButton onClick={() => handleDelete(item.id)} color="error">
										<DeleteIcon />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Snackbar for delete success message */}
			<Snackbar
				open={snackbarOpen}
				autoHideDuration={3000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
			>
				<Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: "100%" }}>
					{snackbarMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default Brand;
