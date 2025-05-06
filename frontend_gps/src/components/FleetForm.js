import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useLocation } from "react-router-dom";
import {
  TextField,
  Button,
  MenuItem,
  Container,
  Typography,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  getBrandData,
  getCarModelData,
  createFleet,
  updateFleet,
} from "../api";

const FleetForm = ({ onSuccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const editFleet = location.state?.fleet || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm();

  const [brands, setBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const selectedBrand = parseInt(watch("brand"), 10);

  useEffect(() => {
    const fetchData = async () => {
      const brandRes = await getBrandData();
      const modelRes = await getCarModelData();
      setBrands(brandRes.data);
      setCarModels(modelRes.data);

      if (!editFleet && brandRes.data.length > 0) {
        setValue("brand", brandRes.data[0].id);
      }
      if (!editFleet && modelRes.data.length > 0) {
        setValue("carModel", modelRes.data[0].id);
      }
    };

    fetchData();
  }, [editFleet, setValue]);

  useEffect(() => {
    if (editFleet && brands.length > 0 && carModels.length > 0) {
      setValue("id", editFleet.id);
      setValue("fleetNumber", editFleet.fleet_number);
      setValue("gpsTrackerId", editFleet.gps_tracker_id);
      setValue("stateNumber", editFleet.state_number);
      setValue("manufactureDate", editFleet.manufacture_date);
      setValue("brand", editFleet.brand);
      setValue("carModel", editFleet.car_model);
    }
  }, [editFleet, brands, carModels, setValue]);

  const filteredCarModels = carModels.filter(
    (model) => model.brand === selectedBrand
  );

  const onSubmit = async (data) => {
    const formattedData = {
      fleet_id:
        data.fleetId?.trim() || Math.random().toString(36).substr(2, 10),
      fleet_number: data.fleetNumber.trim(),
      gps_tracker_id: data.gpsTrackerId,
      state_number: data.stateNumber.trim(),
      manufacture_date: data.manufactureDate,
      brand: parseInt(data.brand, 10),
      car_model: parseInt(data.carModel, 10),
    };

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
      setTimeout(() => navigate("/fleet"), 1500);
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          bgcolor: "#ffffff",
          color: "#333",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#1976d2" }}
        >
          {editFleet ? "✏️ Edit Fleet" : "🚗 Add Fleet"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Brand Selection */}
          <Controller
            name="brand"
            control={control}
            defaultValue={brands[0]?.id || ""}
            rules={{ required: "Please select a brand" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Brand"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }} // 👈 Add this
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
            )}
          />

          {/* Car Model Selection */}
          <Controller
            name="carModel"
            control={control}
            defaultValue={carModels[0]?.id || ""}
            rules={{ required: "Please select a car model" }}
            render={({ field }) => (
              <TextField
                {...field}
                select
                label="Fleet model"
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }} // 👈 Add this
                disabled={!selectedBrand}
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
            )}
          />

          <TextField
            label="Fleet Number"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }} // 👈 Add this
            {...register("fleetNumber", { required: "Fleet number is required" })}
            error={!!errors.fleetNumber}
            helperText={errors.fleetNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField
            label="GPS Tracker ID"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }} // 👈 Add this
            {...register("gpsTrackerId", { required: "GPS Tracker ID is required" })}
            error={!!errors.gpsTrackerId}
            helperText={errors.gpsTrackerId?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField
            label="State Number"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }} // 👈 Add this
            {...register("stateNumber", { required: "State number is required" })}
            error={!!errors.stateNumber}
            helperText={errors.stateNumber?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <TextField
            label="Manufacture Date"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            {...register("manufactureDate", {
              required: "Manufacture date is required",
            })}
            error={!!errors.manufactureDate}
            helperText={errors.manufactureDate?.message}
            sx={{ bgcolor: "#f9f9f9", borderRadius: 1 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "#1976d2",
              color: "#fff",
              fontWeight: "bold",
              "&:hover": { bgcolor: "#1565c0" },
            }}
          >
            {editFleet ? "Update" : "Submit"}
          </Button>
        </form>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FleetForm;
