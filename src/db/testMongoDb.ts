import { MongoMemoryServer } from "mongodb-memory-server"
import { MongoClient } from "mongodb"

let server: MongoMemoryServer
let client: MongoClient

// Функция для запуска сервера
export async function connectTestDb() {
  server = await MongoMemoryServer.create()
  const uri = server.getUri()
  client = new MongoClient(uri)
  await client.connect()
  return client.db() // Возвращаем подключённую временную базу данных
}

// Функция для остановки сервера
export async function disconnectTestDb() {
  if (client) await client.close()
  if (server) await server.stop()
}
