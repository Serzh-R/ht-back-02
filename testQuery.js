const { MongoClient } = require('mongodb')

async function testQuery() {
  const client = new MongoClient('mongodb://localhost:27017')
  await client.connect()

  const db = client.db('mydb')
  const usersCollection = db.collection('users')

  const searchLoginTerm = 'seR'
  const searchEmailTerm = '.com'
  const sortBy = 'login'
  const sortDirection = 1 // 1 для asc, -1 для desc
  const pageNumber = 1
  const pageSize = 15

  const filter = {
    $or: [
      { login: { $regex: searchLoginTerm, $options: 'i' } },
      { email: { $regex: searchEmailTerm, $options: 'i' } },
    ],
  }

  const users = await usersCollection
    .find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .toArray()

  console.log(users)
  await client.close()
}

testQuery().catch(console.error)
