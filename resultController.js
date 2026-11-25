
const Result = require("../models/Result");
const Student = require("../models/Student");
const calculateResult = require("../utils/resultCalculator");

// Validate subject marks
function validateSubjects(subjects) {
    if (!Array.isArray(subjects) || subjects.length === 0) {
        return "At least one subject is required";
    }

    const names = new Set();

    for (const subject of subjects) {
        if (!subject.subjectName ||
            typeof subject.subjectName !== "string" ||
            !Number.isFinite(subject.marks) ||
            !Number.isFinite(subject.maxMarks) ||
            !Number.isFinite(subject.passingMarks)) {
            return "Invalid subject details";
        }

        const name = subject.subjectName.trim().toLowerCase();

        if (names.has(name)) {
            return "Duplicate subjects are not allowed";
        }

        names.add(name);

        if (subject.maxMarks <= 0 ||
            subject.passingMarks < 0 ||
            subject.passingMarks > subject.maxMarks ||
            subject.marks < 0 ||
            subject.marks > subject.maxMarks) {
            return "Invalid marks or maximum marks";
        }
    }

    return null;
}

// Add result
exports.addResult = async (req, res) => {
    try {
        const {
            studentId,
            examName,
            academicYear,
            subjects
        } = req.body;

        if (!studentId || !examName || !academicYear) {
            return res.status(400).json({
                message: "Student, exam and academic year are required"
            });
        }

        if (!/^[0-9a-fA-F]{24}$/.test(studentId)) {
            return res.status(400).json({
                message: "Invalid student ID"
            });
        }

        const validationError = validateSubjects(subjects);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        const result = await Result.create({
            student: studentId,
            examName,
            academicYear,
            subjects
        });

        res.status(201).json({
            message: "Result added successfully",
            result,
            summary: calculateResult(result.subjects)
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Result already exists for this examination"
            });
        }

        res.status(500).json({ message: error.message });
    }
};

// Get all results - admin
exports.getAllResults = async (req, res) => {
    try {
        const results = await Result.find()
            .populate("student", "name rollNo course semester")
            .sort({ createdAt: -1 });

        const data = results.map(result => ({
            ...result.toObject(),
            summary: calculateResult(result.subjects)
        }));

        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get own results - student
exports.getMyResults = async (req, res) => {
    try {
        if (!req.user.studentId) {
            return res.status(404).json({
                message: "Student profile not linked"
            });
        }

        const results = await Result.find({
            student: req.user.studentId
        }).sort({ createdAt: -1 });

        res.json(results.map(result => ({
            ...result.toObject(),
            summary: calculateResult(result.subjects)
        })));

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update result
exports.updateResult = async (req, res) => {
    try {
        const { examName, academicYear, subjects } = req.body;

        if (!examName || !academicYear) {
            return res.status(400).json({
                message: "Exam name and academic year are required"
            });
        }

        const validationError = validateSubjects(subjects);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const result = await Result.findByIdAndUpdate(
            req.params.id,
            { examName, academicYear, subjects },
            { new: true, runValidators: true }
        );

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.json({
            message: "Result updated successfully",
            result,
            summary: calculateResult(result.subjects)
        });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete result
exports.deleteResult = async (req, res) => {
    try {
        const result = await Result.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({
                message: "Result not found"
            });
        }

        res.json({
            message: "Result deleted successfully"
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;
