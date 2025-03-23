import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfessorDashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [professor, setProfessor] = useState(null);
  const [editable, setEditable] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [appliedStudents, setAppliedStudents] = useState({});
  const [chat, setChat] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState(null); // Store chat ID
  const [message, setMessage] = useState("");

  // Fetch professor details
  useEffect(() => {
    const fetchProfessorData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        console.log("Token being sent:", token); // Debugging line

        const response = await axios.get("http://localhost:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.role !== "professor") {
          console.error("Access denied: Not a Professor.");
          navigate("/login");
          return;
        }

        // Ensure projects is always an array
        const professorData = {
          ...response.data,
          projects: Array.isArray(response.data.projects) ? response.data.projects : []
        };

        // Fetch projects from localStorage if new ones are added
        const localProjects = JSON.parse(localStorage.getItem("professorProjects")) || [];

        setProfessor({
          ...professorData,
          projects: [...(professorData.projects || []), ...localProjects],
        });

      } catch (error) {
        console.error("Error fetching professor data:", error);
      }
    };

    fetchProfessorData();
  }, [navigate]);

  const fetchAppliedStudents = async (projectId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(
        `http://localhost:8000/api/project/${projectId}/applied-students`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppliedStudents((prev) => ({ ...prev, [projectId]: response.data.appliedStudents }));
    } catch (error) {
      console.error("Error fetching applied students:", error);
    }
  };

  const handleReview = async (projectId, studentId, status) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put(
        `http://localhost:8000/api/project/${projectId}/review/${studentId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppliedStudents(projectId);
      if (status === "accepted") {
        openChat(studentId);
      }
    } catch (error) {
      console.error("Error updating application status:", error);
    }
  };


  // Open Chat and Fetch Chat ID
  const openChat = async (studentId) => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`http://localhost:8000/api/chat/${studentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChat((prev) => ({ ...prev, [studentId]: response.data.messages }));
      setChatId(response.data.chatId); // Store chat ID
      setSelectedChat(studentId);
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  // Send Message using chatId
  const sendMessage = async () => {
    if (!chatId || !message.trim()) return;

    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:8000/api/chat/${chatId}`,
        { content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChat((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), { sender: "You", content: message }],
      }));
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  // Handle input change
  const handleChange = (e) => {
    setUpdatedData({ ...updatedData, [e.target.name]: e.target.value });
  };

  // Save updates
  // Save updates
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.put("http://localhost:8000/api/dashboard", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfessor((prev) => ({
        ...prev,
        ...updatedData,
      }));

      setEditable(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };
  if (!professor) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1>Professor Dashboard</h1>

      {/* Professor Info Section */}
      <div className="user-info">
        <h2>
          {editable ? (
            <input type="text" name="name" value={updatedData.name} onChange={handleChange} />
          ) : (
            professor.name
          )}
        </h2>

        <p>
          <strong>Department:</strong>{" "}
          {editable ? (
            <input type="text" name="department" value={updatedData.department} onChange={handleChange} />
          ) : (
            professor.department
          )}
        </p>

        <p>
          <strong>Specialization:</strong>{" "}
          {editable ? (
            <input type="text" name="specialization" value={updatedData.specialization} onChange={handleChange} />
          ) : (
            professor.specialization
          )}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {editable ? (
            <input type="text" name="contact" value={updatedData.contact} onChange={handleChange} />
          ) : (
            professor.contact
          )}
        </p>

        <p>
          <strong>About Me:</strong>{" "}
          {editable ? (
            <textarea name="about" value={updatedData.about} onChange={handleChange} />
          ) : (
            professor.about
          )}
        </p>

        <p>
          <strong>Email:</strong> {professor.email} (Cannot be changed)
        </p>

        {/* Edit / Save Button */}
        {editable ? (
          <button className="savebtn" onClick={handleSave}>Save Changes</button>
        ) : (
          <button className="editbtn" onClick={() => setEditable(true)}>Edit Profile</button>
        )}
      </div>

      <div className="projects-section">
        <h2>My Projects</h2>
        {professor?.projects?.length ? (
          <ul>
            {professor.projects.map((project) => (
              <li key={project._id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="viewbtn" onClick={() => fetchAppliedStudents(project._id)}>
                  View Applied Students
                </button>
                {appliedStudents[project._id] && (
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Domain</th>
                        <th>Email</th>
                        <th>Review</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appliedStudents[project._id].map((student) => (
                        <tr key={student.student._id}>
                          <td>{student.student.name}</td>
                          <td>{student.student.skills}</td>
                          <td>{student.student.email}</td>
                          <td>
                            <button className="acceptbtn" onClick={() => handleReview(project._id, student.student._id, "accepted")}>
                              Accept
                            </button>
                            <button className="rejectbtn" onClick={() => handleReview(project._id, student.student._id, "rejected")}>
                              Decline
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No projects added yet.</p>
        )}
      </div>
      {/* Chatbox Section */}
      {selectedChat && (
        <div className="chatbox">
          <h3>Chat with Student</h3>
          <div className="chat-messages">
            {chat[selectedChat]?.map((msg, index) => (
              <p key={index}>
                <strong>{msg.sender.name || "You"}:</strong> {msg.content}
              </p>
            ))}
          </div>
          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
            />
            <button className="sendbtn"onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      {/* Explore Opportunities Button */}
      <button className="explore-projects-btn" onClick={() => navigate("/addproject")}>
        Add Project
      </button>
    </div>
  );
};

export default Dashboard;
