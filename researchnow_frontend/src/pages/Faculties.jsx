import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Faculties.css";

const Faculties = () => {
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch professors from backend
  useEffect(() => {
    const fetchProfessors = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/professors");
        setProfessors(response.data);
      } catch (error) {
        console.error("Error fetching professors:", error);
      }
    };

    fetchProfessors();
  }, []);

  // Filter professors based on search input
  const filteredProfessors = professors.filter((professor) =>
    professor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );



  return (
    <div className="faculties-container">
      <h1 className="page-title">Meet Our Professors</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search professors..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Professor List */}
      <div className="faculties-grid">
        {filteredProfessors.length > 0 ? (
          filteredProfessors.map((professor) => (
            <div key={professor._id} className="faculty-card">
              <div className="faculty-info">
                <h3>{professor.name}</h3>
                <p className="faculty-domain"><strong>Domain:</strong> {professor.domain || "CSE"}</p>
                <p className="faculty-skills"><strong>Skills:</strong> {professor.skills.length > 0 ? professor.skills.join(", ") : "N/A"}</p>
                <button className="profile-button" onClick={() => navigate(`/professor/${professor._id}`)}>View Profile</button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No professors found.</p>
        )}
      </div>
    </div>
  );
};

export default Faculties;
