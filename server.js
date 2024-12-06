const express = require('express');
const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const config = require('./config/config');
const cookieParser = require('cookie-parser'); // Add cookie-parser
const cloudinary = require("cloudinary");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
// Initialize Express app
const app = express();
app.use(express.json({ limit: '50mb' }));  // Increase the limit to 50MB
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to the database
connectDB();
// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log(cloudinary.config());

// Middleware
corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/project', require('./routes/project'));
app.use('/api/document', require('./routes/document'));
app.use('/api/admin', require('./routes/admin'))


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

// Error-handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
const os = require('os');

const networkInterfaces = os.networkInterfaces();
const localIpAddresses = [];

for (const iface in networkInterfaces) {
  networkInterfaces[iface].forEach(details => {
    if (details.family === 'IPv4' && !details.internal) {
      localIpAddresses.push(details.address);
    }
  });
}
const myip = localIpAddresses[0];
console.log('Local IP addresses:', myip);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server running at ==> http://${myip}:${PORT}`);
});