const dotenv = require('dotenv');
const express = require('express');
const cors = require('cors');
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/Auth");
const productRoutes = require("./routes/Product");
const orderRoutes = require("./routes/Order");
const cartRoutes = require("./routes/Cart");
const brandRoutes = require("./routes/Brand");
const categoryRoutes = require("./routes/Category");
const userRoutes = require("./routes/User");
const addressRoutes = require('./routes/Address');
const reviewRoutes = require("./routes/Review");
const wishlistRoutes = require("./routes/Wishlist");
const donationRoutes = require("./routes/Donation");
const { connectToDB } = require("./database/db");

dotenv.config();

// server init
const server = express();

// database connection
connectToDB();

// CORS Configuration - Updated for production
const allowedOrigins = [
  'http://localhost:3000',
  'https://lending-library-books.vercel.app',
  process.env.ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean); // Remove undefined values

server.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(null, true); // Allow anyway for testing
      // callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  exposedHeaders: ['X-Total-Count'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS']
}));

server.use(express.json());
server.use(cookieParser());
server.use(morgan("tiny"));

// routeMiddleware
server.use("/auth", authRoutes);
server.use("/users", userRoutes);
server.use("/products", productRoutes);
server.use("/orders", orderRoutes);
server.use("/cart", cartRoutes);
server.use("/brands", brandRoutes);
server.use("/categories", categoryRoutes);
server.use("/address", addressRoutes);
server.use("/reviews", reviewRoutes);
server.use("/wishlist", wishlistRoutes);
server.use("/", donationRoutes);

// Root route
server.get("/", (req, res) => {
  res.status(200).json({
    message: 'Server is running!',
    environment: process.env.PRODUCTION === 'true' ? 'production' : 'development',
    allowedOrigins: allowedOrigins,
    timestamp: new Date().toISOString()
  });
});

// Health check route (useful for Render)
server.get("/health", (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server [STARTED] ~ http://localhost:${PORT}`);
  console.log(`📦 Environment: ${process.env.PRODUCTION === 'true' ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  console.log(`✅ Allowed Origins:`, allowedOrigins);
});