import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Addproject.css";

const Addproject = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [domain, setDomain] = useState("");
    const [description, setDescription] = useState("");
    const [requiredSkills, setRequiredSkills] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!title || !domain || !description) {
            setError("All fields are required.");
            return;
        }

        const professorId = localStorage.getItem("userId"); // Get professor ID

        if (!professorId) {
            setError("Professor ID not found. Please log in again.");
            return;
        }
        
        try {
            const token = localStorage.getItem("authToken"); // Get auth token
            const response = await axios.post(
                "http://localhost:8000/api/project/create",
                {
                    title,
                    domain,
                    description,
                    requiredSkills: requiredSkills.split(",").map(skill => skill.trim()), // Convert skills to an array
                    professor: professorId,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setSuccess("Project created successfully!");
             // Store project in localStorage
        let projects = JSON.parse(localStorage.getItem("professorProjects")) || [];
        projects.push(response.data.project);
        localStorage.setItem("professorProjects", JSON.stringify(projects));

            setTimeout(() => navigate("/professor-dashboard"), 2000); // Redirect after 2s
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong. Try again.");
        }
    };

    return (
        <div className="addproject">
            <h2>Add Project</h2>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <form onSubmit={handleSubmit} className="addproject-form">
                <input 
                    type="text" 
                    placeholder="Project Title" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Domain" 
                    value={domain} 
                    onChange={(e) => setDomain(e.target.value)} 
                    required 
                />
                <textarea 
                    placeholder="Project Description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Required Skills (comma-separated)" 
                    value={requiredSkills} 
                    onChange={(e) => setRequiredSkills(e.target.value)} 
                />
                <button type="submit" className="submit-button">Create Project</button>
            </form>
        </div>
    );
};

export default Addproject;
