import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Opportunities.css";


const Opportunities = () => {
  const [projects, setProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedProjects, setAppliedProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get("http://localhost:8000/api/project/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch projects. Please try again later.");
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleApply = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`http://localhost:8000/api/project/${projectId}/apply`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppliedProjects((prev) => [...prev, projectId]);
    } catch (err) {
      console.error("Error applying to project:", err);
      alert("Failed to apply. Please try again.");
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="opportunities-container">
      <h1 className="page-title">Explore Research Opportunities</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search opportunities..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Opportunities List */}
      <div className="opportunities-list">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project._id} className="opportunity-card">
              <h3>{project.title}</h3>
              <p><strong>Domain:</strong> {project.domain}</p>
              <p><strong>Description:</strong> {project.description}</p>
              <p><strong>Professor:</strong> {project.professor?.name || "Unknown"}</p>
              <button
                className="apply-button"
                onClick={() => handleApply(project._id)}
                disabled={appliedProjects.includes(project._id)}
              >
                {appliedProjects.includes(project._id) ? "Applied" : "Apply Now"}
              </button>
            </div>
          ))
        ) : (
          <p className="no-results">No opportunities found.</p>
        )}
      </div>
    </div>
  );
};

export default Opportunities;
