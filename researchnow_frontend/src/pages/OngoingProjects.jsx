import React, { useState } from "react";
import "./OngoingProjects.css";

const projectsData = [
  { id: 1, title: "AI in Healthcare", category: "Artificial Intelligence", description: "Developing AI models to detect diseases faster and more accurately." },
  { id: 2, title: "Quantum Computing Simulations", category: "Quantum Computing", description: "Building simulation models to test quantum algorithms." },
  { id: 3, title: "Genetic Engineering", category: "Biotechnology", description: "Advancing CRISPR technology for better gene therapy." },
  { id: 4, title: "Blockchain for Cybersecurity", category: "Cybersecurity", description: "Implementing decentralized security solutions using blockchain." },
];

const OngoingProjects = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projectsData.filter((project) =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="projects-container">
      <h1 className="page-title">Ongoing Research Projects</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search projects..."
        className="search-bar"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Project List */}
      <div className="projects-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title}</h3>
              <p className="project-category">{project.category}</p>
              <p className="project-description">{project.description}</p>
            </div>
          ))
        ) : (
          <p className="no-results">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default OngoingProjects;
