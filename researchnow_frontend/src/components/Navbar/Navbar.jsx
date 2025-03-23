import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";
import { assets } from "../../assets/assets"; // ✅ Fixed Import

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Retrieve user role from localStorage
  const userRole = localStorage.getItem("userRole");

  // Determine Dashboard Route
  const getDashboardRoute = () => {
    if (userRole === "student") return "/student-dashboard";
    if (userRole === "faculty") return "/faculty-dashboard";
    return "/login"; // Default to login if no role found
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <img 
        src={assets.logo1 || ""} 
        width="250" 
        alt="logo" 
        className="logo" 
        onError={(e) => (e.target.style.display = "none")} // Hide if logo fails to load
      />

      {/* Navigation Links */}
      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink></li>
        <li><NavLink to="/aboutus" onClick={() => setMenuOpen(false)}>About Us</NavLink></li>
        <li><NavLink to={getDashboardRoute()} onClick={() => setMenuOpen(false)}>Dashboard</NavLink></li>
        <li><NavLink to="/opportunities" onClick={() => setMenuOpen(false)}>Opportunities</NavLink></li>
        <li><NavLink to="/faculties" onClick={() => setMenuOpen(false)}>Faculties</NavLink></li>
        <li><NavLink to="/ongoing-projects" onClick={() => setMenuOpen(false)}>Ongoing Projects</NavLink></li>
      </ul>

      {/* Login/Signup Buttons */}
      <div className="nav-buttons">
        <button className="login" onClick={() => navigate("/login")}>Log in</button>
        <button className="signup" onClick={() => navigate("/signup")}>Sign up</button>
      </div>
    </nav>
  );
};

export default Navbar;
