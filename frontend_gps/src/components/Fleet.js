import React, { useEffect, useState } from "react";
import { getFleetData } from "../api";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

const Fleet = () => {
  const [fleet, setFleet] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getFleetData();
		console.log("response");
        setFleet(response.data);
      } catch (error) {
        console.error("Error fetching fleet data", error);
      }
    };
    fetchData();
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 5, p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Fleet Information</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Fleet ID</TableCell>
            <TableCell>Fleet Number</TableCell>
            <TableCell>GPS Tracker ID</TableCell>
            <TableCell>State Number</TableCell>
            <TableCell>Manufacture Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {fleet.map((item) => (
            <TableRow key={item.fleet_id}>
              <TableCell>{item.fleet_id}</TableCell>
              <TableCell>{item.fleet_number}</TableCell>
              <TableCell>{item.gps_tracker_id}</TableCell>
              <TableCell>{item.state_number}</TableCell>
              <TableCell>{item.manufacture_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Fleet;
