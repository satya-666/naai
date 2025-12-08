const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const TimeSlot = require('../models/TimeSlot');
const { protect, barber } = require('../middleware/authMiddleware');

// @desc    Create booking
// @route   POST /api/bookings
// @access  User (Protected)
router.post('/', protect, async (req, res) => {
    try {
        const { salonId, slotId } = req.body;

        // Find slot
        const slot = await TimeSlot.findById(slotId);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.isBooked) {
            return res.status(400).json({ message: 'Slot unavailable' });
        }

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

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
