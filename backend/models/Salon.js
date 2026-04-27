const mongoose = require('mongoose');

const salonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String },
    businessKind: { type: String, enum: ['salon', 'shop', 'independent'], default: 'salon' },
    serviceMode: { type: String, enum: ['shop', 'door-to-door', 'both'], default: 'shop' },
    serviceCategory: { type: String, default: 'Haircut and grooming' },
    barberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    images: [{ type: String }], // Array of image URLs
}, { timestamps: true });

module.exports = mongoose.model('Salon', salonSchema);
