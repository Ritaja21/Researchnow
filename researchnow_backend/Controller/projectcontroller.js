const Project = require("../Models/ProjectSchema");
const Chat = require("../Models/ChatSchema");
const User = require("../Models/UserSchema");
const mongoose = require("mongoose");


// Create a project (professor dashboard)
exports.createProject = async (req, res) => {
    try {
        const { title, domain, description, requiredSkills, professor } = req.body;

        if (req.user.role !== "professor") {
            return res.status(403).json({ message: "Access denied. Only professors can create projects." });
        }

        if (!professor) {
            return res.status(400).json({ message: "Professor ID is required." });
        }

        const project = new Project({
            title,
            domain,
            description,
            requiredSkills,
            professor,
        });

        await project.save();
        res.status(201).json({ message: "Project created successfully!", project });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};



// Get all projects (oppurtunities wala page)
exports.getAllProjects = async (req, res) => {
    try {
        const projects = await Project.find().populate("professor", "name");
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};


// Apply to a project (apply button)
exports.applyToProject = async (req, res) => {
    try {
        if (!req.user || req.user.role !== "student") {
            return res.status(401).json({ message: "Unauthorized. Please log in as a student." });
        }

        const { id } = req.params;
        const studentId = req.user.id.toString();

        console.log("Student ID:", studentId); // Debugging

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Project not found!" });
        }
        console.log("Existing Applications:", project.appliedStudents); // Debugging

        if (!Array.isArray(project.appliedStudents)) {
            project.appliedStudents = [];
        }
        const alreadyApplied = project.appliedStudents.some(
            (app) => app.student && app.student.toString() === studentId
        );
        if (alreadyApplied) {
            return res.status(400).json({ message: "You have already applied for this project!" });
        }

        project.appliedStudents.push({ student: new mongoose.Types.ObjectId(studentId), status: "pending" });
        await project.save();

        res.status(200).json({ message: "Application submitted successfully!" });
    } catch (error) {
        console.error("Error in applyToProject:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Get applied students for a project (professor dashboard project e view applied student button )
exports.getAppliedStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const professorId = req.user.id;

        const project = await Project.findById(id).populate("appliedStudents.student", "name email skills");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        if (project.professor.toString() !== professorId.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        res.status(200).json({ appliedStudents: project.appliedStudents });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};

// Accept or reject a student application (review button)
exports.reviewApplication = async (req, res) => {
    try {
        const { id, studentId } = req.params;
        const { status } = req.body;
        const professorId = req.user.id;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const project = await Project.findById(id).populate("appliedStudents.student");
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }


        if (project.professor.toString() !== professorId.toString()) {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        const application = project.appliedStudents.find(app => app.student && app.student._id.toString() === studentId.toString());
        if (!application) {
            return res.status(404).json({ message: "Student has not applied for this project" });
        }

        application.status = status;
        await project.save();

        if (status === "accepted") {
            await User.findByIdAndUpdate(studentId, { $addToSet: { projects: id } });

            const profObjectId = new mongoose.Types.ObjectId(professorId);
            const studObjectId = new mongoose.Types.ObjectId(studentId);

            const existingChat = await Chat.findOne({ professor: profObjectId, student: studObjectId });
            if (!existingChat) {
                const chat = new Chat({ professor: profObjectId, student: studObjectId, messages: [] });
                await chat.save();
            }
        }

        res.status(200).json({ message: `Application ${status} successfully!` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
};
