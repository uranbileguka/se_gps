import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom"; // ✅ Import Router Hooks
import { 
  TextField, Button, MenuItem, Container, Typography, Paper, Snackbar, Alert 
} from "@mui/material";
import { getBrandData, getCarModelData, createFleet, updateFleet } from "../api";
import { Controller } from "react-hook-form";


const FleetForm = ({ onSuccess }) => {  // ✅ Removed duplicate editFleet
  const navigate = useNavigate(); // ✅ Navigation Hook
  const location = useLocation(); // ✅ Get Passed Fleet Data
  const editFleet = location.state?.fleet || null; // ✅ Correctly Get Fleet Data

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  const [brands, setBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const selectedBrand = parseInt(watch("brand"), 10);

  
  useEffect(() => {
    const loadData = async () => {
      await fetchBrands(); // sets brands[]
      await fetchCarModels(); // sets carModels[]
    };
    loadData();
  }, []);

  useEffect(() => {
    if (editFleet && brands.length > 0) {
      console.log("Setting form values:", editFleet.brand);
      console.log("selectedBrand", selectedBrand);

      setValue("id", editFleet.id);
      setValue("fleetNumber", editFleet.fleet_number);
      setValue("gpsTrackerId", editFleet.gps_tracker_id);
      setValue("stateNumber", editFleet.state_number);
      setValue("manufactureDate", editFleet.manufacture_date) ;
      setValue("brand", parseInt(editFleet.brand, 10));
      setValue("carModel", parseInt(editFleet.car_model, 10));
    }
  }, [editFleet, brands, setValue]);


  const fetchBrands = async () => {
    try {
      const response = await getBrandData();
      setBrands(response.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  const fetchCarModels = async () => {
    try {
      const response = await getCarModelData();
      setCarModels(response.data);
    } catch (error) {
      console.error("Error fetching car models:", error);
    }
  };

  // const filteredCarModels = carModels.filter((model) => model.brand === selectedBrand);
  const filteredCarModels = carModels.filter(
    (model) => model.brand === selectedBrand // selectedBrand is now an int
  );
  const onSubmit = async (data) => {
    const formattedData = {
      fleet_id: data.fleetId?.trim() || Math.random().toString(36).substr(2, 10),  // ✅ Auto-generate if missing
      fleet_number: data.fleetNumber.trim(),  // ✅ Matches Django's field name
      gps_tracker_id: data.gpsTrackerId,  // ✅ Correct field name
      state_number: data.stateNumber.trim(),  // ✅ Correct field name
      manufacture_date: data.manufactureDate,  // ✅ Correct field name
      brand: parseInt(data.brand, 10),  // ✅ Ensure it's an integer
      car_model: parseInt(data.carModel, 10)  // ✅ Ensure it's an integer
    };
  
    console.log("Formatted Data for API:", formattedData); // Debugging

    try {
      if (editFleet) {
        await updateFleet(editFleet.id, formattedData);
        setSuccessMessage("Fleet updated successfully!");
      } else {
        await createFleet(formattedData);
        setSuccessMessage("Fleet added successfully!");
      }

      setSuccessOpen(true);
      reset();
      setTimeout(() => navigate("/fleets"), 1500); // ✅ Redirect to Fleet List
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: "#ffffff", color: "#333", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          {editFleet ? "✏️ Edit Fleet" : "🚗 Add Fleet"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Brand Selection */}
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
            {brands.map((brand) => (
              <MenuItem key={brand.id} value={brand.id}>
                {brand.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Car Model Selection */}
          <TextField
            select
            label="Car Model"
            fullWidth
            margin="normal"
            disabled={!selectedBrand}
            {...register("carModel", { required: "Please select a car model" })}
            error={!!errors.carModel}
            helperText={errors.carModel?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          >
            {filteredCarModels.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Fleet Number */}
          <TextField
            label="Fleet Number"
            fullWidth
            margin="normal"
            {...register("fleetNumber", { required: "Fleet number is required" })}
            error={!!errors.fleetNumber}
            helperText={errors.fleetNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          {/* GPS Tracker ID */}
          <TextField
            label="GPS Tracker ID"
            fullWidth
            margin="normal"
            {...register("gpsTrackerId", { required: "GPS Tracker ID is required" })}
            error={!!errors.gpsTrackerId}
            helperText={errors.gpsTrackerId?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          {/* State Number */}
          <TextField
            label="State Number"
            fullWidth
            margin="normal"
            {...register("stateNumber", { required: "State number is required" })}
            error={!!errors.stateNumber}
            helperText={errors.stateNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          {/* Manufacture Date */}
          <TextField
            label="Manufacture Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("manufactureDate", { required: "Manufacture date is required" })}
            error={!!errors.manufactureDate}
            helperText={errors.manufactureDate?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, bgcolor: "#1976d2", color: "#fff", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}
          >
            {editFleet ? "Update" : "Submit"}
          </Button>
        </form>
      </Paper>

      {/* Success Snackbar */}
      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessOpen(false)} severity="success" sx={{ width: "100%" }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FleetForm;
