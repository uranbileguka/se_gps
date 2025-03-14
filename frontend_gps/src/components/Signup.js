import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { registerUser } from "../api";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
      await registerUser({ email, token });
      alert("Signup successful!");
    } catch (error) {
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email" className="form-control" onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" className="form-control mt-2" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="btn btn-primary mt-3">Signup</button>
      </form>
    </div>
  );
};

export default Signup;
