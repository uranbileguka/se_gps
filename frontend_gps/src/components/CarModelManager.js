import React, { useEffect, useState } from "react";
import {
  getCarModelData,
  createCarModel,
  deleteCarModel,
  getBrandData
} from "../api";
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  FormControl,
  InputLabel,
  Paper,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const CarModelManager = () => {
  const [carModels, setCarModels] = useState([]);
  const [brands, setBrands] = useState([]);
  const [newModelName, setNewModelName] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [carModelRes, brandRes] = await Promise.all([
      getCarModelData(),
      getBrandData(),
    ]);
    setCarModels(carModelRes.data);
    setBrands(brandRes.data);
  };

  const handleCreate = async () => {
    if (!newModelName || !selectedBrandId) return;
    await createCarModel(newModelName, selectedBrandId);
    setSuccessMessage("Car model added successfully!");
    setNewModelName("");
    setSelectedBrandId("");
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this car model?")) {
      await deleteCarModel(id);
      setSuccessMessage("Car model deleted successfully!");
      fetchData();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Car Model Manager
      </Typography>

      <Box component={Paper} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Add New Car Model</Typography>
        <Box display="flex" gap={2} mt={2}>
          <TextField
            label="Car Model Name"
            value={newModelName}
            onChange={(e) => setNewModelName(e.target.value)}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Select Brand</InputLabel>
            <Select
              value={selectedBrandId}
              onChange={(e) => setSelectedBrandId(e.target.value)}
            >
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={brand.id}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" onClick={handleCreate}>
            Add
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6">Car Model List</Typography>
        <List>
          {carModels.map((model) => (
            <ListItem
              key={model.id}
              secondaryAction={
                <IconButton onClick={() => handleDelete(model.id)} color="error">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={`${model.brand_name} - ${model.name}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSuccessMessage("")} severity="success">
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarModelManager;
