import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./StudentDashboard.css";
import axios from "axios";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [editable, setEditable] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [chat, setChat] = useState({});
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatId, setChatId] = useState(null); // Store chat ID
  const [message, setMessage] = useState("");

  // Fetch student details
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const token = localStorage.getItem("authToken"); // Ensure correct key
        if (!token) {
          console.error("No token found. Redirecting to login...");
          navigate("/login");
          return;
        }

        console.log("Token being sent:", token); // Debugging line

        const response = await axios.get("http://localhost:8000/api/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.role !== "student") {
          console.error("Access denied: Not a Student.");
          navigate("/login");
          return;
        }

        setStudent(response.data);
        setUpdatedData(response.data);
      } catch (error) {
        console.error("Error fetching student data:", error);
        navigate("/login");
      }
    };

    fetchStudentData();
  }, [chatId]); // Depend only on `navigate` to prevent infinite loops

  const openChat = async (professor) => {
    try {
      const token = localStorage.getItem("authToken");
      const professorId = typeof professor === "object" ? professor._id : professor;
      const response = await axios.get(`http://localhost:8000/api/chat/${professorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.chatId) {
        setChat(response.data.messages);
        setChatId(response.data.chatId);
        setSelectedChat(professorId);
      } else {
        console.error("Chat ID not found!");
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };

  const sendMessage = async () => {
    if (!chatId) {
      console.error("Chat ID is missing!");
      return;
    }
    if (!message.trim()) {
      console.error("Message is empty!");
      return;
    }
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(
        `http://localhost:8000/api/chat/${chatId}`,
        { content: message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat([...chat, { sender: { name: "You" }, content: message }]);
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
  const handleSave = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/login");
        return;
      }

      await axios.put("http://localhost:8000/api/dashboard", updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStudent(updatedData);
      setEditable(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (!student) return <p>Loading...</p>;

  return (
    <div className="dashboard-container">
      <h1>Student Dashboard</h1>

      {/* Student Info Section */}
      <div className="user-info">
        <h2>
          {editable ? (
            <input type="text" name="name" value={updatedData.name || ""} onChange={handleChange} />
          ) : (
            student.name
          )}
        </h2>

        <p>
          <strong>Domain:</strong>{" "}
          {editable ? (
            <input type="text" name="domain" value={updatedData.domain || ""} onChange={handleChange} />
          ) : (
            student.domain
          )}
        </p>

        <p>
          <strong>Contact:</strong>{" "}
          {editable ? (
            <input type="text" name="contact" value={updatedData.contact || ""} onChange={handleChange} />
          ) : (
            student.contact
          )}
        </p>

        <p>
          <strong>About Me:</strong>{" "}
          {editable ? (
            <textarea name="about" value={updatedData.about || ""} onChange={handleChange} />
          ) : (
            student.about
          )}
        </p>

        <p>
          <strong>Email:</strong> {student.email} (Cannot be changed)
        </p>

        {/* Edit / Save Button */}
        {editable ? (
          <button className="savebtn" onClick={handleSave}>Save Changes</button>
        ) : (
          <button className="editbtn" onClick={() => setEditable(true)}>Edit Profile</button>
        )}
      </div>

      {/* Display Projects */}
      <div className="projects-section">
        <h2>My Projects</h2>
        {student.projects && student.projects.length > 0 ? (
          <ul>
            {student.projects.map((project) => (
              <li key={project._id}>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <button className="chatbtn" onClick={() => openChat(project.professor)}>Chat with Professor</button>
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
          <h3>Chat with Professor</h3>
          <div className="chat-messages">
            {chat.map((msg, index) => (
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
            <button className="sendbtn" onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}

      {/* Explore Projects Button */}
      <button className="explore-projects-btn" onClick={() => navigate("/opportunities")}>
        Explore Opportunities
      </button>
    </div>
  );
};

export default StudentDashboard;
