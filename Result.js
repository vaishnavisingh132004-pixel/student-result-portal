
const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: Number,
      required: true
    },
    subjects: [
      {
        subject: {
          type: String,
          required: true,
          trim: true
        },
        marks: {
          type: Number,
          required: true,
          min: 0
        },
        maxMarks: {
          type: Number,
          required: true,
          min: 1
        }
      }
    ],
    totalMarks: {
      type: Number,
      required: true
    },
    maxTotalMarks: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["Pass", "Fail"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
