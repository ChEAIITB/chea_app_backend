const mongoose = require("mongoose");

const networkSchema = new mongoose.Schema(
    {
        nId: {
            type: String,
            required: true,
            unique: true,
        },

        name: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
        },
        domain: {
            type: String,
            required: true,
        },
        skills: {
            type: [String],
            default: [],
        },

        linkedIn: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            default: null,
        },

        pfpLink: {
            type: String,
            default: null,
        },

        experience: {
            type: String,
            required: true,
        },

        isVisible: {
            type: Boolean,
            default: true,
        },

        company: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        year: {
            type: String,
            required: true,
        },

        quote: {
            type: String,
            default: "",
        },

        createdById: {
            type: String,
            required: true,
        },
        createdAt:{
            type:Number,
            required:true
        }
    }
);



module.exports = {networkSchema};