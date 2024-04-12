const mongoose = require("mongoose");

const shortUrlSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true,
        unique: true,
    },
    redirectURL: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    totalClicks: [{ timestamps: { type: Number } }]
}, { timestamps: true });

module.exports = mongoose.model("Url", shortUrlSchema);
