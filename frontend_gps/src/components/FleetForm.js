import React from "react";
import { useForm } from "react-hook-form";
import { TextField, Button, MenuItem, Container, Typography, Paper } from "@mui/material";

const FleetForm = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const onSubmit = (data) => console.log("Form Submitted:", data);
  const selectedBrand = watch("brand");

  const carModels = {
    Toyota: ["Corolla", "Camry", "Rav4", "Hilux"],
    Honda: ["Civic", "Accord", "CR-V", "Pilot"],
    Ford: ["Focus", "Mustang", "Escape", "F-150"],
    BMW: ["X3", "X5", "3 Series", "5 Series"],
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, bgcolor: "#ffffff", color: "#333", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold", color: "#1976d2" }}>
          🚗 Fleet Registration Form
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField select label="Vehicle Type" fullWidth margin="normal"
            {...register("vehicleType", { required: "Please select a vehicle type" })}
            error={!!errors.vehicleType} helperText={errors.vehicleType?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}>
            {['Sedan', 'SUV', 'Truck', 'Van'].map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
          </TextField>

          <TextField select label="Brand" fullWidth margin="normal"
            {...register("brand", { required: "Please select a brand" })}
            error={!!errors.brand} helperText={errors.brand?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}>
            {Object.keys(carModels).map(brand => <MenuItem key={brand} value={brand}>{brand}</MenuItem>)}
          </TextField>

          <TextField select label="Car Model" fullWidth margin="normal" disabled={!selectedBrand}
            {...register("carModel", { required: "Please select a car model" })}
            error={!!errors.carModel} helperText={errors.carModel?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}>
            {selectedBrand && carModels[selectedBrand].map(model => <MenuItem key={model} value={model}>{model}</MenuItem>)}
          </TextField>

          <TextField label="Fleet Number" fullWidth margin="normal"
            {...register("fleetNumber", { required: "Fleet number is required" })}
            error={!!errors.fleetNumber} helperText={errors.fleetNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField label="GPS Tracker ID" fullWidth margin="normal"
            {...register("gpsTrackerId", { required: "GPS Tracker ID is required" })}
            error={!!errors.gpsTrackerId} helperText={errors.gpsTrackerId?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField label="State Number" fullWidth margin="normal"
            {...register("stateNumber", { required: "State number is required" })}
            error={!!errors.stateNumber} helperText={errors.stateNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField label="Manufacture Date" type="date" fullWidth margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("manufactureDate", { required: "Manufacture date is required" })}
            error={!!errors.manufactureDate} helperText={errors.manufactureDate?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "#1976d2", color: "#fff", fontWeight: "bold", '&:hover': { bgcolor: "#1565c0" } }}>
            Submit
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default FleetForm;
