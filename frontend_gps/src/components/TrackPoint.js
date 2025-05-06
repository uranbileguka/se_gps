import React, { useEffect, useState } from "react";
import {
  getAlltechnics,
  gettrackpoint,
} from "../api";
import {
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 47.918873, // Default center (e.g., Ulaanbaatar)
  lng: 106.917701,
};

const TrackPoint = () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 16);
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 16);

  const [startDate, setStartDate] = useState(firstOfMonth);
  const [endDate, setEndDate] = useState(today);
  const [technics, setTechnic] = useState([]);
  const [selectedTechnic, setSelectedTechnic] = useState("");
  const [trackPoints, setTrackPoints] = useState([]);

  useEffect(() => {
    const fetchTechnics = async () => {
      try {
        const data = await getAlltechnics();
        setTechnic(data);
      } catch (error) {
        console.error("Failed to fetch Technics:", error);
      }
    };
    fetchTechnics();
  }, []);

  useEffect(() => {
    const fetchTrackPoint = async () => {
      try {
        const data = await gettrackpoint({
          start_date: startDate,
          end_date: endDate,
          technic: selectedTechnic || undefined,
        });
        console.log("Track Points:", data);
        setTrackPoints(data);
      } catch (error) {
        console.error("Failed to fetch track points:", error);
      }
    };
    fetchTrackPoint();
  }, [startDate, endDate, selectedTechnic]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fleet GPS Tracking
      </Typography>

      {/* 📅 Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          type="datetime-local"
          label="Start DateTime"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="datetime-local"
          label="End DateTime"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="Technic"
          value={selectedTechnic}
          onChange={(e) => setSelectedTechnic(e.target.value)}
          SelectProps={{ native: true }}
          InputLabelProps={{ shrink: true }}
        >
          <option value="">All technics</option>
          {technics.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.fleet_number}
            </option>
          ))}
        </TextField>
      </Box>

      {/* 🗺️ Google Map */}
      <LoadScript googleMapsApiKey="AIzaSyAr_Xq-WbKQAv3_accQJjUzoBr5TbEUnf0">
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={6}>
          {trackPoints.map((point, index) => (
            <Marker
              key={index}
              position={{ lat: point.latitude, lng: point.longitude }}
              label={point.name}
            />
          ))}
        </GoogleMap>
      </LoadScript>
    </Box>
  );
};

export default TrackPoint;
