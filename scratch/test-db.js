const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local');
    return;
  }

  console.log('Attempting to connect to:', uri.split('@')[1]); // Log only the cluster part for safety

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('✅ Successfully connected to MongoDB!');
    const databases = await client.db().admin().listDatabases();
    console.log('Databases:', databases.databases.map(db => db.name));
  } catch (err) {
    console.error('❌ Connection failed:');
    console.error(err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('\nTip: This often means your IP address is not whitelisted in MongoDB Atlas or a firewall is blocking the connection.');
    }
  } finally {
    await client.close();
  }
}

testConnection();
