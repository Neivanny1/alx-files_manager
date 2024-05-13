import { ObjectID } from 'mongodb';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';

class FilesController {
    static async postUpload (req, res) {
    const token = req.header('X-Token');
    const userId = await redisClient.get(`auth_${token}`);

    // Check if user is authenticated
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Destructure request body
    const { name, type, parentId = '0', isPublic = false, data } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }
    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type or invalid type' });
    }
    if ((type === 'file' || type === 'image') && !data) {
      return res.status(400).json({ error: 'Missing data' });
    }

    // If parentId is provided, validate parent
    if (parentId !== '0') {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: ObjectID(parentId) });
      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }
      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    let localPath = null;
    if (type === 'file' || type === 'image') {
      // Decode Base64 data and write to local file
      const buffer = Buffer.from(data, 'base64');
      const fileName = uuidv4();
      const filePath = `${FOLDER_PATH}/${fileName}`;
      fs.writeFileSync(filePath, buffer);
      localPath = filePath;
    }

    // Save file to database
    const filesCollection = dbClient.db.collection('files');
    const newFile = {
      userId,
      name,
      type,
      parentId,
      isPublic,
      localPath
    };
    const result = await filesCollection.insertOne(newFile);
    const fileId = result.insertedId;

    // Return the new file
    res.status(201).json({ id: fileId, ...newFile });
  }
}

export default FilesController;
