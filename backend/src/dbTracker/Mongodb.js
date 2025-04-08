import { MongoClient } from 'mongodb';

async function setupChangeStream(uri, dbName) {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db(dbName);

    const changeStream = db.watch([], {
      fullDocument: 'updateLookup'
    });

    console.log(`Watching all collections in database: ${dbName}`);

    changeStream.on('change', (change) => {
      console.log(' Change detected:\n', JSON.stringify(change, null, 2));
    });

  } catch (error) {
    console.error(' Error setting up change stream:', error);
  }
}


export default setupChangeStream;
