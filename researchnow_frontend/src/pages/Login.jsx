import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("student"); // Default to Student
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error

    try {
      const response = await axios.post("http://localhost:8000/api/auth/login", { email, password });

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;

        console.log("Token received:", token); // Debugging
        console.log("User ID:", user._id); // Debugging
        console.log("User role:", user.role); // Debugging

        // Store token and user details in localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", user._id); // Store userId
        localStorage.setItem("userRole", user.role);
        localStorage.setItem("userEmail", user.email);

        // Redirect based on role
        if (user.role === "student") {
          navigate("/student-dashboard");
        } else if (user.role === "professor") {
          navigate("/professor-dashboard");
        } else {
          console.error("Invalid role:", user.role);
          setError("Invalid user role. Please contact support.");
        }
      } else {
        setError("Invalid response from server. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>

      {/* Role Selection */}
      <div className="role-selection">
        <button className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
          Student
        </button>
        <button className={role === "professor" ? "active" : ""} onClick={() => setRole("professor")}>
          Professor
        </button>
      </div>
      {/* Display Error Message */}
      {error && <p className="error-message">{error}</p>}
      {/* Login Form */}
      <form onSubmit={handleSubmit} className="login-form">
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-button">Login as {role}</button>
      </form>

      {/* Signup Option */}
      <p className="signup-option">
        Don't have an account? <span onClick={() => navigate("/signup")}>Sign up</span>
      </p>
    </div>
  );
};

export default Login;
