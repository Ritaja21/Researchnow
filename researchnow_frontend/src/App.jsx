import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Navbar from "./components/Navbar/Navbar";
import Aboutus from "./pages/Aboutus";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import OngoingProjects from "./pages/OngoingProjects";
import Opportunities from "./pages/Opportunities";
import Faculties from "./pages/Faculties";
import SignUp from "./pages/SignUp";
import Addproject from "./pages/Addproject";
import Professorprofile from "./pages/Professorprofile";
import "./index.css"; // Ensuring global styles are included

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
        <Route path="/ongoing-projects" element={<OngoingProjects />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/addproject" element={<Addproject />} />
        <Route path="/faculties" element={<Faculties />} />
        <Route path="/professor/:id" element={<Professorprofile />} />
      </Routes>
    </Router>
  );
};

export default App;
