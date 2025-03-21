import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "./pages/Header";
import Dashboard from "./pages/Dashboard";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Fleet from "./components/Fleet";
import FleetForm from "./components/FleetForm";
import FleetBrandForm from "./components/FleetBrandForm";
import FleetModelForm from "./components/FleetModelForm";
import Brand from "./components/Brand";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboard/>} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/brand" element={<Brand />} />
        <Route path="/fleet-form" element={<FleetForm />} />
        <Route path="/fleet-model-form" element={< FleetModelForm/>} />
        <Route path="/fleet-brand-form" element={<FleetBrandForm />} />

      </Routes>
    </Router>
  );
};

export default App;
