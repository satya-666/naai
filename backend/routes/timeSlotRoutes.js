const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const Salon = require('../models/Salon');
const { protect, barber } = require('../middleware/authMiddleware');

// @desc    Get slots by salon
// @route   GET /api/timeslots/:salonId
router.get('/:salonId', async (req, res) => {
    try {
        const slots = await TimeSlot.find({ salonId: req.params.salonId }).sort({ startTime: 1 });
        res.json(slots);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create slot
// @route   POST /api/timeslots
// @access  Barber
router.post('/', protect, barber, async (req, res) => {
    try {
        const { salonId, startTime } = req.body;

        const slot = await TimeSlot.create({
            salonId,
            startTime,
            isBooked: false
        });
        res.status(201).json(slot);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Delete slot
// @route   DELETE /api/timeslots/:id
// @access  Barber
router.delete('/:id', protect, barber, async (req, res) => {
    try {
        const slot = await TimeSlot.findById(req.params.id);

        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        // Verify ownership via Salon
        const salon = await Salon.findById(slot.salonId);
        if (salon.barberId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await slot.deleteOne();
        res.json({ message: 'Slot removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
