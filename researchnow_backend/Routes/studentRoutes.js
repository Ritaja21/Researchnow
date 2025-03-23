const express = require("express");
const { getStudentDashboard } = require("../Controller/studentcontroller");
const authenticateUser  = require("../Middlewares/authMiddleware");

const router = express.Router();

router.get("/:id", authenticateUser, getStudentDashboard);

module.exports = router;
