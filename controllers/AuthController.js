import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const AuthController = {
  getConnect: async (req, res) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Extract email and password from Authorization header
    const authData = authHeader.split(' ')[1];
    const authDecoded = Buffer.from(authData, 'base64').toString();
    const [email, password] = authDecoded.split(':');

    // Find user by email and password (assuming passwords are stored as SHA1)
    const user = await dbClient.db.collection('users').findOne({ email, password: sha1(password) });

    // If user not found, return Unauthorized
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Generate authentication token
    const token = uuidv4();

    // Store token in Redis with user ID for 24 hours
    await redisClient.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 3600);

    // Respond with token
    return res.status(200).json({ token });
  },

  getDisconnect: async (req, res) => {
    const token = req.headers['x-token'];

    // Check if X-Token header is present
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete token from Redis
    await redisClient.del(`auth_${token}`);

    // Respond with success
    return res.status(204).end();
  },
};

module.exports = AuthController;
