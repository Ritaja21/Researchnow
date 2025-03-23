const User = require("../Models/UserSchema");
const Project = require("../Models/ProjectSchema");

exports.getProfessorDashboard = async (req, res) => {
    try {
        const { id } = req.params; // ✅ Extract id from params

        const professor = await User.findById(id).select("-password").populate("projects");
       
        if (!professor || professor.role !== "professor") {
            return res.status(404).json({ message: "Professor not found!" });
        }

        const projects = await Project.find({ professor: id });

        res.status(200).json({
            professor,
            projects
        });
    } catch (error) {
        console.error("Error fetching professor dashboard:", error);
        res.status(500).json({ message: "Server error" });
    }
};
