

const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middlewares/authMiddleware");
const User = require("../Models/UserSchema");

// Get user details based on role
router.get("/", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: "projects",
            populate: { path: "professor", select: "name email" } // Fetch professor details too
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check user role and return appropriate details
        if (user.role === "student") {
            return res.json({
                role: user.role,
                name: user.name,
                email: user.email,
                domain: user.domain || "",
                contact: user.contact || "",
                about: user.about || "",
                projects: user.projects || [],
            });
        } else if (user.role === "professor") {
            return res.json({
                role: user.role,
                name: user.name,
                email: user.email,
                expertise: user.expertise || "",
                skills: user.skills || [],
                contact: user.contact || "",
                about: user.about || "",
            });
        } else {
            return res.status(400).json({ message: "Invalid role" });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// Update user details (excluding email)
router.put("/", authMiddleware, async (req, res) => {
    const { name, domain, contact, about, expertise, skills } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update based on role
        if (user.role === "student") {
            user.name = name || user.name;
            user.domain = domain || user.domain;
            user.contact = contact || user.contact;
            user.about = about || user.about;
        } else if (user.role === "professor") {
            user.name = name || user.name;
            user.expertise = expertise || user.expertise;
            user.skills = skills || user.skills;
            user.contact = contact || user.contact;
            user.about = about || user.about;
        }

        const updatedUser = await user.save();
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: "Error updating profile" });
    }
});

module.exports = router;
