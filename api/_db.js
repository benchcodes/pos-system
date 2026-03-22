import dns from 'node:dns'
import { MongoClient } from 'mongodb'

// Use reliable public DNS to resolve MongoDB SRV records in serverless environments.
dns.setServers(['1.1.1.1', '8.8.8.8'])

const uri = process.env.ATLAS_URI
const dbName = process.env.DB_NAME || 'pos_system'

if (!uri) {
  throw new Error('ATLAS_URI is missing in Vercel Environment Variables')
}

let clientPromise = globalThis.__posMongoClientPromise

if (!clientPromise) {
  const client = new MongoClient(uri)
  clientPromise = client.connect()
  globalThis.__posMongoClientPromise = clientPromise
}

export async function getDb() {
  const client = await clientPromise
  return client.db(dbName)
}
