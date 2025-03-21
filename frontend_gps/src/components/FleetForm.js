import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Typography, Box } from "@mui/material";

const FleetForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  // Watch selected brand to filter car models dynamically (if needed)
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
          Fleet Registration Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Vehicle Type */}
          <TextField
            select
            label="Vehicle Type"
            fullWidth
            margin="normal"
            {...register("vehicleType", { required: "Please select a vehicle type" })}
            error={!!errors.vehicleType}
            helperText={errors.vehicleType?.message}
          >
            <MenuItem value="Sedan">Sedan</MenuItem>
            <MenuItem value="SUV">SUV</MenuItem>
            <MenuItem value="Truck">Truck</MenuItem>
            <MenuItem value="Van">Van</MenuItem>
          </TextField>
          {/* Vehicle Brand */}
          <TextField
            select
            label="Brand"
            fullWidth
            margin="normal"
            {...register("brand", { required: "Please select a brand" })}
            error={!!errors.brand}
            helperText={errors.brand?.message}
          >
            {Object.keys(carModels).map((brand) => (
              <MenuItem key={brand} value={brand}>
                {brand}
              </MenuItem>
            ))}
          </TextField>
          {/* Car Model (Depends on selected Brand) */}
          <TextField
            select
            label="Car Model"
            fullWidth
            margin="normal"
            {...register("carModel", { required: "Please select a car model" })}
            error={!!errors.carModel}
            helperText={errors.carModel?.message}
            disabled={!selectedBrand}
          >
            {selectedBrand &&
              carModels[selectedBrand].map((model) => (
                <MenuItem key={model} value={model}>
                  {model}
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
          />
          {/* GPS Tracker ID */}
          <TextField
            label="GPS Tracker ID"
            fullWidth
            margin="normal"
            {...register("gpsTrackerId", { required: "GPS Tracker ID is required" })}
            error={!!errors.gpsTrackerId}
            helperText={errors.gpsTrackerId?.message}
          />
          {/* State Number */}
          <TextField
            label="State Number"
            fullWidth
            margin="normal"
            {...register("stateNumber", { required: "State number is required" })}
            error={!!errors.stateNumber}
            helperText={errors.stateNumber?.message}
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
          />
          <Button type="submit" variant="contained" sx={{ mt: 2, backgroundColor: "#f5b700", color: "#000" }}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default FleetForm;
