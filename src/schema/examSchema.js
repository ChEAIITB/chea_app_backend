const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        examId: {
            type: String,
            required: true,
            unique: true,
        },

        courseCode: {
            type: String,
            required: true,
        },

        courseName: {
            type: String,
            required: true,
        },

        examName: {
            type: String,
            required: true,
        },

        targetUser: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        examTime: {
            type: Date,
            required: true,
        },

        examDuration: {
            type: Number,
            required: true,
        },

        ExamSyllabus: {
            type: String,
            default: "",
        },

        ExamWeightage: {
            type: String,
            default: "",
        },
    }
);

