import { useState } from "react";
import { registerUser } from "../api"; // Import API function
import "bootstrap/dist/css/bootstrap.min.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser({ username, email, password });
      alert("Signup successful!");
      window.location.href = "/dashboard"; // Redirect after signup
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed: " + JSON.stringify(error)); // Show detailed error
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        backgroundImage: "url('https://source.unsplash.com/1600x900/?fleet,truck')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card shadow-lg p-4" style={{ width: "380px", borderRadius: "15px", background: "rgba(255, 255, 255, 0.95)" }}>
        <h3 className="text-center mb-3 text-primary">Fleet Management</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
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
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
        <p className="text-center mt-3">
          Already have an account? <a href="/login" className="text-decoration-none text-secondary">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
