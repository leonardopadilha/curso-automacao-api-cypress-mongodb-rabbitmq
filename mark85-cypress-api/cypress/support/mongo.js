const { MongoClient } = require('mongodb')

const mongoURI = 'string-conexao-mongo'
const client = new MongoClient(mongoURI)

async function connect() {
    await client.connect()
    return client.db('markdb')
}

async function disconnect() {
    await client.disconnect()
}

module.exports = {
    connect,
    disconnect
}