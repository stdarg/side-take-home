// Functions related to the MongoDB data store are here.

const env = require('env-var')
const debug = require('debug')('side:db')
const { MongoClient } = require('mongodb')

// Enviroment variables read in here
const MONGO_DB_NAME = env.get('MONGO_DB_NAME').required().asString()
const MONGO_USER = env.get('MONGO_USER').required().asString()
const MONGO_CRED = env.get('MONGO_CRED').required().asString()
const MONGO_COL_FAVORITES = env.get('MONGO_COL_FAVORITES').required().asString()
const MONGO_CLUSTER_DNS = env.get('MONGO_CLUSTER_DNS').required().asString()
const MONGO_COL_USERS = env.get('MONGO_COL_USERS').required().asString()

// create the URI connect string using the env variables here
const uri = `mongodb+srv://${MONGO_USER}:${MONGO_CRED}@` +
    `${MONGO_CLUSTER_DNS}/${MONGO_DB_NAME}?retryWrites=true&w=majority`

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true })

async function connectDb () {
  await client.connect()
  await client.db('admin').command({ ping: 1 })
  debug('Connected successfully to db server')
}

async function lookupUser (token) {
  const db = client.db(MONGO_DB_NAME)
  const users = db.collection(MONGO_COL_USERS)
  const query = { token: token }
  const user = await users.findOne(query)
  debug('lookup user found:', user)
  return user
}

async function incFavoriteCount (listingId) {
  const db = client.db(MONGO_DB_NAME)
  const collection = db.collection(MONGO_COL_FAVORITES)
  const query = { listingId: listingId }
  const update = { $inc: { count: 1 }, $set: { listingId: listingId } }
  const options = { upsert: true, returnOriginal: false }
  const doc = await collection.findOneAndUpdate(query, update, options, false)
  if (!doc || !doc.value || !doc.value.listingId || !doc.value.count) {
    debug('incFavoriteCount, bad document returned', doc)
  }
  return { listingId: doc.value.listingId, count: doc.value.count }
}

async function getFavoriteCount (listingId) {
  const db = client.db(MONGO_DB_NAME)
  const collection = db.collection(MONGO_COL_FAVORITES)
  const query = { listingId: listingId }
  const doc = await collection.findOne(query)
  if (!doc) {
    debug('getFavoriteCount: no document, returning 0')
    return 0
  }
  return doc.count
}

module.exports = {
  connectDb,
  lookupUser,
  incFavoriteCount,
  getFavoriteCount
}
