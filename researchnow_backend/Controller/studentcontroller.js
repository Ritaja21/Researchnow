const User = require("../Models/UserSchema");
const Project = require("../Models/ProjectSchema");

exports.getStudentDashboard = async (req, res) => {
    try {
        const { id } = req.params; 
        
        const student = await User.findById(id).select("-password");//no password
        if (!student || student.role !== "student") {
            return res.status(404).json({ message: "Student not found!" });
        }
       
        const projects = await Project.find({ "appliedStudents.student": id });

        res.status(200).json({
            student,
            projects
        });
    } catch (error) {
        console.error("Error fetching student dashboard:", error);
        res.status(500).json({ message: "Server error" });
    }
};
