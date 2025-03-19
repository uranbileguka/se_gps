import React, { useState } from "react";
import { login } from "../api"; // Import login function from api.js

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send credentials to Django backend for authentication
      const response = await login({ email, password });

      alert("Login successful!");
      localStorage.setItem("token", response.token); // Store token for authentication
      window.location.href = "/dashboard"; // Redirect after login
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed: " + (error.error || "Invalid credentials"));
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mt-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary mt-3">Login</button>
      </form>
    </div>
  );
};

export default Login;
