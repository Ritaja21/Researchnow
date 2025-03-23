const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "professor"], required: true },
    domain: {type:String},
    contact: {type:String},
    about : {type:String},
    skills: { type: [String] },
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Project" }] // Referencing Projects
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
