import React, { useEffect, useState } from "react";
import { technicCountByTechnic, getAlltechnics ,
	technicCountByDate, fuelCountByDate, fuelCountByTechnic
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
  ReferenceLine,
} from "recharts";


const API_URL = "http://127.0.0.1:8000/navixy/api";

const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const FuelReport = () => {
  const today = new Date().toISOString().split("T")[0];

  const [startDate, setStartDate] = useState("2025-05-01");
  const [endDate, setEndDate] = useState(today);
  const [barData, setBarData] = useState([]);
  const [lineData, setLineData] = useState([]);

//   technic
  const [technics, setTechnic] = useState([]);
  const [selectedTechnic, setSelectedTechnic] = useState("");
  const cleanedData = lineData.map(item => {
    console.log("percent..", item.worked_percent);
    console.log("percent..",  (item.line_date));

    return {
      ...item,
      worked_percent: isNaN(item.worked_percent) ? 0 : (item.worked_percent),
    };
  });
  
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
	const fetchFuelReport = async () => {
	  try {
		const data = await fuelCountByTechnic({
		  start_date: startDate,
		  end_date: endDate,
		  technic: selectedTechnic || undefined, // only include if selected
		});
		console.log("API Data:", data);
		console.log("API selectedTechnic:", selectedTechnic);

		setBarData(data);
	  } catch (error) {
		console.error("Failed to fetch zone report:", error);
	  }
	};
  
	fetchFuelReport();
  }, [startDate, endDate, selectedTechnic]);

  useEffect(() => {
	const fetchDateReport = async () => {
	  try {
		const data = await fuelCountByDate({
		  start_date: startDate,
		  end_date: endDate,
		  technic: selectedTechnic || undefined, // only include if selected
		});
		console.log("API Data:", data);
		console.log("API selectedTechnic:", selectedTechnic);

		setLineData(data);
	  } catch (error) {
		console.error("Failed to fetch zone report:", error);
	  }
	};
  
	fetchDateReport();
  }, [startDate, endDate, selectedTechnic]);


  const pieFleetData = barData.map(item => ({
	name: item.fleet_number,
	value: item.consumed_per_mile,
  }));

  // Sum total worked and total hours
  const totalFuelConsumtion = Math.round(barData.reduce((sum, item) => sum + (item.total_consumed || 0), 0));
  const totalMileage = Math.round(barData.reduce((sum, item) => sum + (item.total_mileage || 0), 0));

  // Compute total percent (worked / total) as a float → then round
  const totalFuelPerMileage = totalMileage > 0 
  ? (totalFuelConsumtion / totalMileage).toFixed(2) 
  : '0.00';
  // Max fleet based on total_worked_hour
  const maxFleet = barData.reduce((max, item) => {
    return item.total_consumed > max.total_consumed ? item : max;
  }, { total_consumed: -Infinity });

  // Min fleet based on totalFuelConsumtion
  const minFleet = barData.reduce((min, item) => {
    return item.total_consumed < min.total_consumed ? item : min;
  }, { total_consumed: Infinity });

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
	  		Fleet fuel consumption Report
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

      {/* 📊 Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Total fuel consumption</Typography>
              <Typography variant="h5">{totalFuelConsumtion}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Fuel consumption per mile %</Typography>
              <Typography variant="h5">{totalFuelPerMileage }</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Max fuel consumption</Typography>
              <Typography variant="h5">{maxFleet.fleet_number}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Min fuel consumption</Typography>
              <Typography variant="h5">{minFleet.fleet_number}</Typography>
            </CardContent>
          </Card>
        </Grid>        
      </Grid>

      {/* 📈 Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fuel consumption by date
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={cleanedData}>
                <XAxis dataKey="line_date" />
                <YAxis /> {/* ✅ Removed percent formatting */}
                <Tooltip /> {/* ✅ Raw values */}
                {/* Optional: remove or update goal line based on actual scale */}
                <ReferenceLine y={3000} stroke="red" strokeDasharray="5 5" label="Goal" />
                <Line type="monotone" dataKey="total_consumed" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>


        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fuel consumption
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
                  label={({ name, value }) => `${name}: ${value}`}
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
              Fleet fuel consumption per mile
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fleet_number" />
                <YAxis />
                <Tooltip/>
                <Legend />
                <Bar
                  dataKey="consumed_per_mile"
                  name="Consumed"
                  fill="#8884d8"
                  label={{
                    position: 'top',
                    formatter: (value) => Number(value).toFixed(2)
                  }}
                    />
                                    {/* ➕ Goal Line at 80% */}
                <ReferenceLine y={2} stroke="red" strokeDasharray="3 3" label={{ value: 'Goal: 2.0', position: 'top', fill: 'red' }} />              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FuelReport;
