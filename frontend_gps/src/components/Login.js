import React, { useState } from "react";
import { login } from "../api"; // Import login function from api.js
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login({ email, password });

      alert("Login successful!");
      localStorage.setItem("token", response.token); // Store token for authentication
      window.location.href = "/zoneReport"; // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + (error.error || "Invalid credentials"));
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: "url('/FleetManagementBackground.jpeg')", // Updated background image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "350px",
          borderRadius: "15px",
          background: "rgba(255, 255, 255, 0.9)",
        }}
      >
        <h3 className="text-center mb-3 text-primary">Fleet Management</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              placeholder="Email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              placeholder="Password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          <a href="/forgot-password" className="text-decoration-none text-secondary">
            Forgot Password?
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
