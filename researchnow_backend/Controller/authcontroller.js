const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/UserSchema");

// Register User
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role, expertise, skills } = req.body;
        console.log("Received registration request:", req.body); // Debugging line
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
        console.log("Hashing password...");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Creating new user...");
        user = new User({ name, email, password: hashedPassword, role, expertise, skills });
        await user.save();
        console.log("User saved successfully!");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "User registered successfully", token });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("Received login request:", req.body); // Debugging line
        
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        console.log("User found, verifying password...");
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        
        console.log("Password matched, generating token...");
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Login successful", token, user });

    } catch (error) {
        console.error("Error in loginuser", error);
        res.status(500).json({ message: "Server error", error });
    }
};
