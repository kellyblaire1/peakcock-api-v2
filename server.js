// server.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const dotenv = require('dotenv');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');

const http = require('http'); // Import http module
const { Server } = require('socket.io');

const mysql = require('mysql2/promise');


const { connectDb, syncDb } = require('./Config/Sequelize');
const Database = require('./Config/Database');

// Load environment variables from .env file
dotenv.config();

// Connect to the sequelize database
connectDb();

// // check MySQL connection pool
// const pool = Database.pool;
// pool.getConnection()
//     .then((connection) => {
//         console.log('Connected to MySQL');
//         connection.release(); // Release the connection back to the pool
//     })
//     .catch((err) => {
//         console.error('Error connecting to MySQL:', err);
//     });

// Initialize express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware Setup
app.use(helmet()); // Security headers
app.use(compression()); // Gzip compression
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // HTTP request logger

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Basic Routes
app.get('/', (req, res) => {
    res.send(`Welcome to the ${process.env.APPNAME} application!`);
});

// Import and use your routes
const authRoutes = require('./Routes/authRoutes.js');
const chatRoutes = require('./Routes/chatRoutes.js');
const commentRoutes = require('./Routes/commentRoutes.js');
const commentLikeRoutes = require('./Routes/commentLikeRoutes.js');
const commentMediaRoutes = require('./Routes/commentMediaRoutes.js');
const conversationRoutes = require('./Routes/conversationRoutes.js');
const feedbackRoutes = require('./Routes/feedbackRoutes.js');
const feedRoutes = require('./Routes/feedRoutes.js');
const followRoutes = require('./Routes/followRoutes.js');
const giftCommentRoutes = require('./Routes/giftCommentRoutes.js');
const giftRoutes = require('./Routes/giftRoutes.js');
const giftLikeRoutes = require('./Routes/giftLikeRoutes.js');
const giftMediaRoutes = require('./Routes/giftMediaRoutes.js');
const giftRequestRoutes = require('./Routes/giftRequestRoutes.js');
const giftViewRoutes = require('./Routes/giftViewRoutes.js');
const hashtagRoutes = require('./Routes/hashtagRoutes.js');
const likeRoutes = require('./Routes/likeRoutes.js');
const mediaRoutes = require('./Routes/mediaRoutes.js');
const notificationRoutes = require('./Routes/notificationRoutes.js');
const notificationSettingRoutes = require('./Routes/notificationSettingRoutes.js');
const postRoutes = require('./Routes/postRoutes.js');
const postMediaRoutes = require('./Routes/postMediaRoutes.js');
const postViewRoutes = require('./Routes/postViewRoutes.js');
const replyRoutes = require('./Routes/replyRoutes.js');
const giftSaveRoutes = require('./Routes/giftSaveRoutes.js');
const postSaveRoutes = require('./Routes/postSaveRoutes.js');
const socketRoutes = require('./Routes/socketRoutes.js');
const subcategoryRoutes = require('./Routes/subcategoryRoutes.js');


// Use the routes
app.use('/v1/auth', authRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
    });
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

// Sync Database
syncDb();

// Define the port
const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
