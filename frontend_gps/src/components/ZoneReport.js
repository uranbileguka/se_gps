import React, { useEffect, useState } from "react";
import { locationCountByTechnic, getAllLocations ,
	locationCountByDate
} from "../api";

import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
  TextField,
} from "@mui/material";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";


const API_URL = "/navixy/api";

const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const ZoneReport = () => {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState(today);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

//   location
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
	const fetchLocations = async () => {
	  try {
		const data = await getAllLocations();
		setLocations(data);
	  } catch (error) {
		console.error("Failed to fetch locations:", error);
	  }
	};
  
	fetchLocations();
  }, []);
  
  useEffect(() => {
	const fetchZoneReport = async () => {
	  try {
		const data = await locationCountByTechnic({
		  start_date: startDate,
		  end_date: endDate,
		  location: selectedLocation || undefined, // only include if selected
		});
		console.log("API Data:", data);
		console.log("API selectedLocation:", selectedLocation);

		setBarData(data);
	  } catch (error) {
		console.error("Failed to fetch zone report:", error);
	  }
	};
  
	fetchZoneReport();
  }, [startDate, endDate, selectedLocation]);

  useEffect(() => {
	const fetchZoneDateReport = async () => {
	  try {
		const data = await locationCountByDate({
		  start_date: startDate,
		  end_date: endDate,
		  location: selectedLocation || undefined, // only include if selected
		});
		console.log("API Data:", data);
		console.log("API selectedLocation:", selectedLocation);

		setLineData(data);
	  } catch (error) {
		console.error("Failed to fetch zone report:", error);
	  }
	};
  
	fetchZoneDateReport();
  }, [startDate, endDate, selectedLocation]);


  const pieFleetData = barData.map(item => ({
	name: item.fleet_number,
	value: item.count,
  }));

  const totalCount = barData.reduce((sum, item) => sum + item.count, 0);
  const averageCountperCar = barData.length > 0 ? Math.round((totalCount / barData.length) * 10) / 10 : 0;
  const averageCountperDay = lineData.length > 0 ? Math.round((totalCount / lineData.length) * 10) / 10 : 0;  
  const maxFleet = barData.reduce((max, item) => {
	return item.count > max.count ? item : max;
  }, { count: -Infinity });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
	  		Fleet Zone Entry Report
      </Typography>

      {/* 📅 Date Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
		<TextField
			select
			label="Location"
			value={selectedLocation}
			onChange={(e) => setSelectedLocation(e.target.value)}
			SelectProps={{ native: true }}
			InputLabelProps={{ shrink: true }}
		>
			<option value="">All Locations</option>
			{locations.map((loc) => (
			<option key={loc.id} value={loc.id}>
				{loc.english_name}
			</option>
			))}
		</TextField>		
      </Box>

      {/* 📊 Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Total entry</Typography>
              <Typography variant="h5">{totalCount}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Average entry per day</Typography>
              <Typography variant="h5">{averageCountperCar}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Average entry per car</Typography>
              <Typography variant="h5">{averageCountperDay}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Most visited fleet</Typography>
              <Typography variant="h5">{maxFleet.fleet_number}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 📈 Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Zone Entry by Date
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="line_date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
            Zone Entry by Technic
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieFleetData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieFleetData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
            ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* ✅ New Bar Chart */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
            Zone Entry by Technic
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fleet_number" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Location Count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ZoneReport;
