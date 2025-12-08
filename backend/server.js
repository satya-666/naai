const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes Placeholder
app.get('/', (req, res) => res.send('API is running...'));

// Routes
const path = require('path');

// ... existing code ...

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/salons', require('./routes/salonRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/timeslots', require('./routes/timeSlotRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
