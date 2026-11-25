
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    rollNo: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    course: {
        type: String,
        required: true
    },

    semester: {
        type: Number,
        required: true,
        min: 1
    },

    department: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model("Student", studentSchema);
