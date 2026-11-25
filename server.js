
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const resultRoutes = require("./routes/resultRoutes");

const app = express();

app.use(cors());
app.use(express.json({ limit: "100kb" }));

// Frontend
app.use(express.static(path.join(__dirname, "public")));

// Backend APIs
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/results", resultRoutes);

// API health check
app.get("/api/health", (req, res) => {
    res.json({
        status: "success",
        message: "Student Result Portal API is running"
    });
});

// 404 handler for API routes
app.use("/api", (req, res) => {
    res.status(404).json({
        message: "API endpoint not found"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: "Internal server error"
    });
});

const PORT = process.env.PORT || 3000;

async function startServer() {
    if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
        throw new Error("Missing environment configuration");
    }

    await connectDB();

    app.listen(PORT, () => {
        console.log(
            `Server running at http://localhost:${PORT}`
        );
    });
}

startServer().catch(error => {
    console.error(error.message);
    process.exit(1);
});
