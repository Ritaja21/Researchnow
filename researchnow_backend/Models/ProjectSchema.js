const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    domain: { type: String, required: true },
    description: { type: String, required: true },
    professor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requiredSkills: [{ type: String }],
    appliedStudents: [
        {
          student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" }
        }
    ],
    selectedStudent: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Project", ProjectSchema);
