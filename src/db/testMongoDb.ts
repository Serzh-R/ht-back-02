import { MongoMemoryServer } from "mongodb-memory-server"
import { runDb } from "./mongoDb"

let server: MongoMemoryServer

export const connectTestDb = async () => {
  server = await MongoMemoryServer.create()
  await runDb(server.getUri())
}

export const disconnectTestDb = async () => {
  if (server) await server.stop() // Останавливаем MongoMemoryServer.
}
