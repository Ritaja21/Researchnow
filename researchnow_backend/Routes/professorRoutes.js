const express = require("express");
const User = require("../Models/UserSchema");
const { getProfessorDashboard } = require("../Controller/professorcontroller");
const authenticateUser = require("../Middlewares/authMiddleware");



const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const professors = await User.find({ role: "professor" }).select("name domain skills");
        
        if (!professors || professors.length === 0) {
            return res.status(404).json({ message: "No professors found" });
        }

        res.status(200).json(professors);
    } catch (error) {
        console.error("Error fetching professors:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/:id", authenticateUser, getProfessorDashboard);

module.exports = router;
