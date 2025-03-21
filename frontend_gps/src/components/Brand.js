import React, { useEffect, useState } from "react";
import { getBrandData } from "../api";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography
} from "@mui/material";

const Brand = () => {
	const [brands, setBrands] = useState([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await getBrandData();
				console.log("Fetched brand data:", response.data);
				setBrands(response.data);
			} catch (error) {
				console.error("Error fetching brand data:", error);
			}
		};
		fetchData();
	}, []);

	return (
		<TableContainer component={Paper} sx={{ mt: 5, p: 3 }}>
			<Typography variant="h5" sx={{ mb: 2 }}>
				Brand List
			</Typography>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell>ID</TableCell>
						<TableCell>Brand Name</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{brands.map((item) => (
						<TableRow key={item.id}>
							<TableCell>{item.id}</TableCell>
							<TableCell>{item.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default Brand;
