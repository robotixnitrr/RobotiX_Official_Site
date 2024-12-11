const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true, 
    },
    date: {
        type: Date,
        required: true,
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    time:{
        type: String,
        required: true,
    }

},{timestamps: true})

export const Workshop = mongoose.model("Workshop", WorkshopSchema);