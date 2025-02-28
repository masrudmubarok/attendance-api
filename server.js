require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/config/database');
const redisClient = require('./config/redis');
const elasticClient = require('./config/elastic');
const attendanceRoutes = require('./src/routes/attendanceRoutes');
const authRoutes = require('./src/routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/attendance', attendanceRoutes);

app.get('/health', async (req, res) => {
  try {
    await db.authenticate();
    await redisClient.ping();
    await elasticClient.ping();
    res.status(200).json({ status: 'UP', message: 'All services are healthy' });
  } catch (error) {
    res.status(500).json({ status: 'DOWN', error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await db.sync();
    console.log('Database connected successfully');
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();