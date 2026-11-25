
const express = require("express");
const router = express.Router();

const Result = require("../models/Result");
const User = require("../models/User");

// Admin: Add student result
router.post("/add", async (req, res) => {
  try {
    const {
      rollNo,
      semester,
      subjects
    } = req.body;

    if (!rollNo || !semester || !subjects || subjects.length === 0) {
      return res.status(400).json({
        message: "Please enter all result details"
      });
    }

    // Check whether student exists
    const student = await User.findOne({
      rollNo: rollNo,
      role: "student"
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found"
      });
    }

    // Calculate total marks
    let totalMarks = 0;
    let maxTotalMarks = 0;

    for (const item of subjects) {
      const marks = Number(item.marks);
      const maxMarks = Number(item.maxMarks);

      if (
        !item.subject ||
        !Number.isFinite(marks) ||
        !Number.isFinite(maxMarks) ||
        maxMarks <= 0 ||
        marks < 0 ||
        marks > maxMarks
      ) {
        return res.status(400).json({
          message: "Invalid subject marks"
        });
      }

      totalMarks += marks;
      maxTotalMarks += maxMarks;
    }

    const percentage = Number(
      ((totalMarks / maxTotalMarks) * 100).toFixed(2)
    );

    const status = percentage >= 40 ? "Pass" : "Fail";

    // Save result
    const result = await Result.create({
      rollNo,
      semester,
      subjects,
      totalMarks,
      maxTotalMarks,
      percentage,
      status
    });

    res.status(201).json({
      message: "Result added successfully",
      result
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error while adding result"
    });
  }
});

module.exports = router;
