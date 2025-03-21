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
	Box
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FleetBrandForm from "./FleetBrandForm";

const Brand = () => {
	const [brands, setBrands] = useState([]);
	const [editBrand, setEditBrand] = useState(null); // Track selected brand

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
				fetchData(); // Refresh table
				setEditBrand(null); // Reset form if deleting selected item
			} catch (error) {
				console.error("Delete error:", error);
			}
		}
	};

	return (
		<Box>
			<FleetBrandForm editBrand={editBrand} onSuccess={fetchData} />

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
								onClick={() => setEditBrand(item)} // Set brand in form
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
		</Box>
	);
};

export default Brand;
