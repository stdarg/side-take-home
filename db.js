
const { MongoClient } = require("mongodb");
// Connection URI
const MONGO_DB_NAME="side-takehome-db"
const MONGO_USER="side-take-home"
const MONGO_CRED="very-good-job-8876"
const MONGO_COL_FAVORITES="favorites"
const MONGO_COL_USERS="users"
const uri = "mongodb+srv://side-take-home:very-good-job-8876@cluster0.na4he.mongodb.net/side-takehome-db?retryWrites=true&w=majority"

// Create a new MongoClient
const client = new MongoClient(uri);

async function connect() {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");
    return client
}

async function lookup_user(token) {
    const database = client.db("side-takehome-db");
    const users = database.collection("users");
    const query = { token: token };
    const user = await users.findOne(query)
    console.log("USER:", user)
    return user
}


async function run() {
    await connect()
    // user = await lookup_user("676cfd34-e706-4cce-87ca-97f947c43bd4").catch(console.dir);
    // console.log(user)
}
run().catch(console.dir);

module.exports = {
    lookup_user: lookup_user
}
