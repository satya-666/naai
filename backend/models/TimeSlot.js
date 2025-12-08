const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    salonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salon', required: true },
    startTime: { type: Date, required: true }, // Using Date object for precise time
    isBooked: { type: Boolean, default: false },
}, { timestamps: true });

// Prevent duplicate slots for same time/salon? Maybe app logic.

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
