const express = require("express");
const {
    createProject,
    getAllProjects,
    applyToProject,   
    getAppliedStudents, 
    reviewApplication
} = require("../Controller/projectcontroller.js");
const protect = require("../Middlewares/authMiddleware");

const router = express.Router();

router.post("/create", protect, createProject);//professor
router.get("/all", protect, getAllProjects);//students
router.post("/:id/apply", protect, applyToProject); // Students 
router.get("/:id/applied-students", protect, getAppliedStudents); // professor
router.put("/:id/review/:studentId", protect, reviewApplication); //professor

module.exports = router;
