const express = require('express');
const router = express.Router();
const Salon = require('../models/Salon');
const { protect, admin, barber } = require('../middleware/authMiddleware');

// @desc    Get all salons with Search, Filter, Sort, Pagination
// @route   GET /api/salons
router.get('/', async (req, res) => {
    try {
        const { search, city, sort, page = 1, limit = 2 } = req.query;

        let query = {};

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by city
        if (city) {
            query.city = { $regex: city, $options: 'i' };
        }

        // Sorting
        let sortOption = {};
        if (sort === 'newest') sortOption = { createdAt: -1 };
        else if (sort === 'oldest') sortOption = { createdAt: 1 };
        else sortOption = { createdAt: -1 }; // Default

        // Pagination
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const salons = await Salon.find(query)
            .populate('barberId', 'name email')
            .sort(sortOption)
            .skip(skip)
            .limit(limitNum);

        const total = await Salon.countDocuments(query);

        res.json({
            salons,
            currentPage: pageNum,
            totalPages: Math.ceil(total / limitNum),
            totalSalons: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get salon by ID
// @route   GET /api/salons/:id
router.get('/:id', async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id).populate('barberId', 'name email');
        if (salon) {
            res.json(salon);
        } else {
            res.status(404).json({ message: 'Salon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a salon
// @route   POST /api/salons
// @access  Barber/Admin
router.post('/', protect, barber, async (req, res) => {
    try {
        const { name, address, city, description, images, businessKind, serviceMode, serviceCategory } = req.body;

        // Random placeholder images if none provided
        const salonImages = images && images.length > 0 ? images : [
            `https://picsum.photos/seed/${name.replace(/\s/g, '')}1/400/300`,
            `https://picsum.photos/seed/${name.replace(/\s/g, '')}2/400/300`
        ];

        const salon = new Salon({
            name,
            address,
            city,
            description,
            businessKind,
            serviceMode,
            serviceCategory,
            barberId: req.user._id,
            images: salonImages
        });

        const createdSalon = await salon.save();
        res.status(201).json(createdSalon);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Update salon
// @route   PUT /api/salons/:id
// @access  Barber (owner)/Admin
router.put('/:id', protect, barber, async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);

        if (salon) {
            if (salon.barberId.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized' });
            }

            salon.name = req.body.name || salon.name;
            salon.address = req.body.address || salon.address;
            salon.city = req.body.city || salon.city;
            salon.description = req.body.description || salon.description;
            salon.businessKind = req.body.businessKind || salon.businessKind;
            salon.serviceMode = req.body.serviceMode || salon.serviceMode;
            salon.serviceCategory = req.body.serviceCategory || salon.serviceCategory;
            if (req.body.images) salon.images = req.body.images;

            const updatedSalon = await salon.save();
            res.json(updatedSalon);
        } else {
            res.status(404).json({ message: 'Salon not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// @desc    Delete salon
// @route   DELETE /api/salons/:id
// @access  Admin or Barber (Owner)
router.delete('/:id', protect, barber, async (req, res) => {
    try {
        const salon = await Salon.findById(req.params.id);

        if (salon) {
            // Check if user is admin OR the owner
            if (req.user.role !== 'admin' && salon.barberId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'Not authorized to delete this salon' });
            }

            await salon.deleteOne();
            res.json({ message: 'Salon removed' });
        } else {
            res.status(404).json({ message: 'Salon not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
