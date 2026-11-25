const express = require("express");
const router = express.Router();

const {
    protect,
    adminOnly,
    studentOnly
} = require("../middleware/authMiddleware");

const {
    addStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

const Student = require("../models/Student");

router.get("/me", protect, studentOnly, async (req, res) => {
    try {
        const student = await Student.findById(req.user.studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student profile not found"
            });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/", protect, adminOnly, getStudents);
router.post("/", protect, adminOnly, addStudent);

router.get("/:id", protect, adminOnly, getStudentById);
router.put("/:id", protect, adminOnly, updateStudent);
router.delete("/:id", protect, adminOnly, deleteStudent);

module.exports = router;