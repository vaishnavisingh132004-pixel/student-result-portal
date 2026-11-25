
const Student = require("../models/Student");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Add student
exports.addStudent = async (req, res) => {
    try {
        const {
            rollNo,
            name,
            email,
            course,
            semester,
            department,
            phone,
            password
        } = req.body;

        if (!rollNo || !name || !email || !course ||
            !semester || !department || !password) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        if (!Number.isInteger(Number(semester)) ||
            Number(semester) < 1) {
            return res.status(400).json({
                message: "Invalid semester"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                message: "Password must contain at least 8 characters"
            });
        }

        const existing = await Student.findOne({
            rollNo: rollNo.trim()
        });

        if (existing) {
            return res.status(409).json({
                message: "Roll number already exists"
            });
        }

        const username = rollNo.trim().toLowerCase();

        if (await User.findOne({ username })) {
            return res.status(409).json({
                message: "Student username already exists"
            });
        }

        const student = await Student.create({
            rollNo: rollNo.trim(),
            name,
            email,
            course,
            semester: Number(semester),
            department,
            phone
        });

        try {
            const hashedPassword = await bcrypt.hash(password, 12);

            await User.create({
                username,
                password: hashedPassword,
                role: "student",
                student: student._id
            });
        } catch (error) {
            await Student.findByIdAndDelete(student._id);
            throw error;
        }

        res.status(201).json({
            message: "Student added successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all students
exports.getStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get student by ID
exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(400).json({ message: "Invalid student ID" });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        const allowed = [
            "name", "email", "course",
            "semester", "department", "phone"
        ];

        const updates = {};

        for (const key of allowed) {
            if (req.body[key] !== undefined) {
                updates[key] = req.body[key];
            }
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updates,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete student and associated records
exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const Result = require("../models/Result");

        await Result.deleteMany({ student: student._id });
        await User.deleteMany({ student: student._id });

        res.json({
            message: "Student and associated records deleted"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
