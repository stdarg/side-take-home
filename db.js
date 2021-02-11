const env = require('env-var')
const debug = require('debug')('side:db')
const { MongoClient } = require('mongodb')

const MONGO_DB_NAME = env.get('MONGO_DB_NAME').required()
const MONGO_USER = env.get('MONGO_USER').required().asString()
const MONGO_CRED = env.get('MONGO_CRED').required().asString()
// const MONGO_COL_FAVORITES=env.get('MONGO_COL_FAVORITES').required().asString()
const MONGO_CLUSTER_DNS = env.get('MONGO_CLUSTER_DNS').required().asString()
const MONGO_COL_USERS = env.get('MONGO_COL_USERS').required().asString()

const uri = `mongodb+srv://${MONGO_USER}:${MONGO_CRED}@` +
    `${MONGO_CLUSTER_DNS}/${MONGO_DB_NAME}?retryWrites=true&w=majority`

// Create a new MongoClient
const client = new MongoClient(uri, { useUnifiedTopology: true })

async function connectDb () {
  // Connect the client to the server
  await client.connect()
  // Establish and verify connection
  await client.db('admin').command({ ping: 1 })
  debug('Connected successfully to db server')
}

async function lookupUser (token) {
  const database = client.db(MONGO_DB_NAME)
  const users = database.collection(MONGO_COL_USERS)
  const query = { token: token }
  const user = await users.findOne(query)
  debug('lookup user found:', user)
  return user
}

module.exports = {
  connectDb,
  lookupUser
}
