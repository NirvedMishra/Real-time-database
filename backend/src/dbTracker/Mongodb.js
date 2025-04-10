import { MongoClient } from 'mongodb';
import { User } from '../models/user.model.js';
import { producer } from '../utils/kafka.js';



function parseChange(change) {
  const timestamp = new Date(change.clusterTime.getHighBits() * 1000); // Convert BSON timestamp to JS Date

  return {
    collectionName: change.ns.coll,
    documentId: change.documentKey._id.toString(),
    operationType: change.operationType,
    time: timestamp
  };
}

const activeStreams = new Map();

async function startTracking(userId, connectionString, database) {
  if (activeStreams.has(userId)) {
    console.log('Already tracking this user');
    return;
  }
  const client = new MongoClient(connectionString);
  await client.connect();
  const db = client.db(database); // default db
  const changeStream = db.watch();

  changeStream.on('change', async (change) => {
  

    const updateData = parseChange(change);
    await User.findByIdAndUpdate(
      userId,
      { $push: { dbUpdates: updateData } },
      { new: true }
    )

    await producer.send({
      topic: 'db-change',
      messages: [{
        // include userId so the consumer can route
        value: JSON.stringify({ userId, 
          collectionName:updateData.collectionName, documentId:updateData.documentId, operationType:updateData.operationType, time:updateData.time 
        })
      }]
    });
  });

  activeStreams.set(userId, { client, changeStream });
}

async function stopTracking(userId) {
  const stream = activeStreams.get(userId);
  const user = await User.findById(userId);
  if (stream) {
    await stream.changeStream.close();
    await stream.client.close();
    activeStreams.delete(userId);
    user.isTracking = false;
    await user.save();
  }
}
const resumeTrackingForActiveUsers = async () => {
  const activeUsers = await User.find({ isTracking: true });

  console.log(`Resuming tracking for ${activeUsers.length} users`);

  for (const user of activeUsers) {
    try {
      await startTracking(user._id, user.dbString,user.dbName); // or pass the whole user if your function accepts it
      console.log(`Tracking resumed for user ${user._id}`);
    } catch (error) {
      console.error(`Failed to resume tracking for user ${user._id}:`, error);
    }
  }
};

function isTracking(userId) {
  return activeStreams.has(userId);
}

export { startTracking, stopTracking, isTracking ,resumeTrackingForActiveUsers};
