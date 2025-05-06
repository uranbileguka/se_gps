import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import React Router
import { getFleetData, deleteFleet } from "../api";
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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const Fleet = () => {
  const [fleets, setFleets] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate(); // ✅ React Router Navigation

  const fetchData = async () => {
    try {
      const response = await getFleetData();
      setFleets(response.data);
    } catch (error) {
      console.error("Error fetching fleet data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this fleet?")) {
      try {
        await deleteFleet(id);
        setSnackbarMessage("Fleet deleted successfully!");
        setSnackbarOpen(true);
        fetchData();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const handleEdit = (fleet) => {
    // console.log("editing fleet:", fleet.brand);
    // console.log("editing fleet:", fleet.car_model);
    navigate(`/edit-fleet/${fleet.id}`, { state: { fleet } }); // ✅ Navigate to Fleet Form
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ mt: 5, p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Fleet Information</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Fleet ID</TableCell>
              <TableCell>Fleet Number</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Car Model</TableCell>
              <TableCell>GPS Tracker ID</TableCell>
              <TableCell>State Number</TableCell>
              <TableCell>Manufacture Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fleets.map((item) => (
              <TableRow key={item.id} hover sx={{ cursor: "pointer" }} onClick={() => handleEdit(item)}>
                <TableCell>{item.fleet_id}</TableCell>
                <TableCell>{item.fleet_number}</TableCell>
                <TableCell>{item.brand_name}</TableCell>
                <TableCell>{item.car_model_name}</TableCell>
                <TableCell>{item.gps_tracker_id}</TableCell>
                <TableCell>{item.state_number}</TableCell>
                <TableCell>{item.manufacture_date}</TableCell>
                <TableCell>
                  <IconButton onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Fleet;
