const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const Salon = require('../models/Salon');
const { protect, barber } = require('../middleware/authMiddleware');

// @desc    Create booking
// @route   POST /api/bookings
// @access  User (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const { salonId, slotId } = req.body;

        if (req.user.role !== 'user') {
            return res.status(403).json({ message: 'Only customers can book appointments' });
        }

        if (!salonId || !slotId) {
            return res.status(400).json({ message: 'Salon and slot are required' });
        }

        const salon = await Salon.findById(salonId);
        if (!salon) {
            return res.status(404).json({ message: 'Salon not found' });
        }

        const slot = await TimeSlot.findOneAndUpdate(
            { _id: slotId, salonId, isBooked: false, startTime: { $gt: new Date() } },
            { isBooked: true },
            { new: true }
        );

        if (!slot) {
            const existingSlot = await TimeSlot.findById(slotId);
            if (existingSlot && existingSlot.salonId.toString() !== salonId) {
                return res.status(400).json({ message: 'Slot does not belong to this salon' });
            }
            if (existingSlot && existingSlot.isBooked) {
                return res.status(400).json({ message: 'Slot unavailable' });
            }
            if (existingSlot && existingSlot.startTime <= new Date()) {
                return res.status(400).json({ message: 'This slot has already passed' });
            }
            return res.status(404).json({ message: 'Slot not found' });
        }

        const booking = await Booking.create({
            userId: req.user.id,
            salonId,
            slotId
        });

        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get user bookings
// @route   GET /api/bookings/mybookings
// @access  User
router.get('/mybookings', protect, async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('salonId')
            .populate('slotId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get salon bookings (for barber)
// @route   GET /api/bookings/salon/:salonId
// @access  Barber
router.get('/salon/:salonId', protect, barber, async (req, res) => {
    try {
        const bookings = await Booking.find({ salonId: req.params.salonId })
            .populate('userId', 'name email')
            .populate('slotId');
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
