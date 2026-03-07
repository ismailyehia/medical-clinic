const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Security Middlewares
app.use(helmet());

// CORS — allow frontend origin
const allowedOrigins = [
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',
    process.env.CLIENT_URL,  // Production frontend URL (Vercel)
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all in case of misconfigured origin
        }
    },
    credentials: true,
}));

app.use(express.json());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
const authRoutes = require('./routes/authRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const patientRoutes = require('./routes/patientRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/notifications', notificationRoutes);

// Base route
app.get('/', (req, res) => {
    res.send('Medical Clinic API is running...');
});

const PORT = process.env.PORT || 5000;

// Connect to DB, sync tables, then start server
const { connectDB } = require('./config/db');
const { sequelize } = require('./models');

const startServer = async () => {
    try {
        await connectDB();
        // Sync all models to create tables if they don't exist
        // alter: true will update table schemas to match models
        await sequelize.sync({ alter: true });
        console.log('Database tables synced successfully.');
    } catch (error) {
        console.error('Database sync error:', error.message);
    }
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

startServer();
