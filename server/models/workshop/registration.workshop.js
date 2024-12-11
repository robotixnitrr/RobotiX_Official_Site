const mongoose = require('mongoose');

const RegSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true, 
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
            index: true,
            match: /^(\+91[-\s]?)?[0]?(91)?[789]\d{9}$/, 
        },
        workshop: {
            type: String,
            required: true,
        },
        registration_date: {
            type: Date,
            default: Date.now, 
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Reg', RegSchema); 
