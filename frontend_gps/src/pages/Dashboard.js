import React from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  // Mock data for charts
  const lineData = [
    { name: "Jan", activity: 120 },
    { name: "Feb", activity: 200 },
    { name: "Mar", activity: 150 },
    { name: "Apr", activity: 250 },
    { name: "May", activity: 180 },
  ];

  const pieData = [
    { name: "Trucks", value: 400 },
    { name: "Vans", value: 300 },
    { name: "Cars", value: 300 },
    { name: "Bikes", value: 200 },
  ];

  const pieColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Fleet Management Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Total Fleets</Typography>
              <Typography variant="h5">1,200</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Active Today</Typography>
              <Typography variant="h5">315</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">GPS Issues</Typography>
              <Typography variant="h5">18</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ p: 2 }}>
            <CardContent>
              <Typography variant="h6">Maintenance Due</Typography>
              <Typography variant="h5">42</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fleet Activity Over Months
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="activity" stroke="#1976d2" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fleet Type Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
