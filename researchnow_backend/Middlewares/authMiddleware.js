
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    const authHeader = req.header("Authorization");

 
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.error("Unauthorized Access: No valid token found.");
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    try {
       
        const token = authHeader.split(" ")[1]; 
        console.log("Received Token for Verification:", token); // Debugging
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded User:", decoded); // Debugging

        req.user = decoded;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(400).json({ message: "Invalid Token" });
    }
};


