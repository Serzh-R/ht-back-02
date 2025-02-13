import { app } from './app'
import { SETTINGS } from './settings'
import { runDb } from './db/mongoDb'

app.set('trust proxy', true) // ✅ Позволяет корректно получать `req.ip` за прокси

const startApp = async () => {
  console.log(SETTINGS.MONGO_URL, 'mongoURL')
  const res = await runDb(SETTINGS.MONGO_URL)
  if (!res) process.exit(1) // метод в Node.js который немедленно завершает выполнение программы с указанным кодом выхода (0 - успешно, 1 - ошибка)

  app.listen(SETTINGS.PORT, () => {
    console.log('...server started in port ' + SETTINGS.PORT)
  })
}

startApp()
