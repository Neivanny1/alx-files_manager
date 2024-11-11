// AppController.js

// Import dbClient and redisClient
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

const AppController = {
  /**
   * @swagger
   * /status:
   *   get:
   *     summary: Check the status of the database and Redis server
   *     description: Returns the status of the connection to Redis and MongoDB.
   *     responses:
   *       200:
   *         description: Status of Redis and database connection
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 redis:
   *                   type: boolean
   *                   description: Redis connection status (true if connected)
   *                 db:
   *                   type: boolean
   *                   description: Database connection status (true if connected)
   */
  getStatus: async (req, res) => {
    const dbStatus = dbClient.isAlive();
    const redisStatus = redisClient.isAlive();
    res.status(200).json({ redis: redisStatus, db: dbStatus });
  },

  /**
   * @swagger
   * /stats:
   *   get:
   *     summary: Retrieve counts of users and files
   *     description: Returns the total number of users and files in the database.
   *     responses:
   *       200:
   *         description: User and file statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 users:
   *                   type: integer
   *                   description: Total number of users
   *                 files:
   *                   type: integer
   *                   description: Total number of files
   */
  getStats: async (req, res) => {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();
    res.status(200).json({ users: userCount, files: fileCount });
  },
};

module.exports = AppController;

