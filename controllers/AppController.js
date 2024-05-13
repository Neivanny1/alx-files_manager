// AppController.js

// Import dbClient and redisClient
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AppController = {
  getStatus: async (req, res) => {
    // Check DB status
    const dbStatus = dbClient.isAlive();
    // Check Redis status
    const redisStatus = redisClient.isAlive();

    // Respond with status
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  },

  getStats: async (req, res) => {
    // Get number of users and files from the database
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();

    // Respond with stats
    res.status(200).json({ users: userCount, files: fileCount });
  },
};

module.exports = AppController;
