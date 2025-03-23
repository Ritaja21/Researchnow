import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Professorprofile.css";

const Professorprofile = () => {
    const { id } = useParams();
    const [professor, setProfessor] = useState(null);

    useEffect(() => {
        const fetchProfessorDetails = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const headers = token ? { Authorization: `Bearer ${token}` } : {};
                const response = await axios.get(`http://localhost:8000/api/professors/${id}`, {
                    headers,
                });
                console.log("Professor Details:", response.data);
                setProfessor(response.data.professor);
            } catch (error) {
                console.error("Error fetching professor details:", error.response?.data || error.message);
            }
        };

        fetchProfessorDetails();
    }, [id]);


    if (!professor) return <p>Loading professor details...</p>;

    return (
        <div className="professorprofile">
            <h1 className="profname">{professor.name}</h1>
            <p><strong>Domain:</strong> {professor.domain || "CSE"}</p>
            <p><strong>Contact:</strong> {professor.contact || "N/A"}</p>
            <p><strong>About:</strong> {professor.about || "No details available"}</p>
        </div>
    );
};

export default Professorprofile;
