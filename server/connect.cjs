const path = require('path');
const dns = require('node:dns');
const { MongoClient } = require('mongodb');

require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Force public DNS servers so Node can resolve MongoDB SRV records properly
dns.setServers(['1.1.1.1', '8.8.8.8']);

const uri = process.env.ATLAS_URI;
const dbName = process.env.DB_NAME || 'pos_system';

if (!uri) {
    throw new Error('ATLAS_URI is missing in server/config.env');
}

console.log('Loaded DB_NAME:', dbName);

const client = new MongoClient(uri);

async function connectToMongoDB() {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
}

function getDb() {
    return client.db(dbName);
}

async function closeMongoDB() {
    await client.close();
}

module.exports = {
    connectToMongoDB,
    getDb,
    closeMongoDB,
};

// Allows running `node server/connect.cjs` to quickly test the connection.
if (require.main === module) {
    connectToMongoDB()
        .then(() => closeMongoDB())
        .catch((error) => {
            console.error('MongoDB connection failed:', error);
            process.exit(1);
        });
}