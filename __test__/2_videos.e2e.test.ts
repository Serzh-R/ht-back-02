import {req} from './test-helpers'
import {setDB} from '../src/db/db'
import {SETTINGS} from '../src/settings'
import {CreateVideoInputModel, ResolutionsEnam} from '../src/types/types';

describe('/videos', () => {
    beforeAll(async () => { // очистка базы данных перед началом тестирования
        setDB()
    })

    it('should get empty array', async () => {
        setDB() // очистка базы данных если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200) // проверяем наличие эндпоинта

        console.log(res.body) // можно посмотреть ответ эндпоинта

        expect(res.body.length).toBe(0) // проверяем ответ эндпоинта
    })
    it('should get not empty array', async () => {

        const dataset1 = {
            videos: [{id: 1, title: 'title', author: 'author', canBeDownloaded: false, minAgeRestriction: null,
                createdAt: new Date().toISOString(), publicationDate: new Date(Date.now() + 86400000).toISOString(),
                availableResolutions: [ResolutionsEnam.P1440]}],
        }

        setDB(dataset1) // заполнение базы данных начальными данными если нужно

        const res = await req
            .get(SETTINGS.PATH.VIDEOS)
            .expect(200)

        console.log(res.body)

        expect(res.body.length).toBe(1)
        expect(res.body[0]).toEqual(dataset1.videos[0])
    })
    it('should create', async () => {
        setDB()
        const newVideo: CreateVideoInputModel = {
            title: 'title',
            author: 'author',
            availableResolutions: [ResolutionsEnam.P1440]
        }

        const res = await req
            .post(SETTINGS.PATH.VIDEOS)
            .send(newVideo) // отправка данных
            expect(201)

        console.log(res.body)

        expect(res.body.availableResolutions).toEqual(newVideo.availableResolutions)
    })
    it('shouldn\'t find', async () => {
        const dataset1 = {
            videos: [{id: 1, title: 'title', author: 'author', canBeDownloaded: false, minAgeRestriction: null,
                createdAt: new Date().toISOString(), publicationDate: new Date(Date.now() + 86400000).toISOString(),
                availableResolutions: [ResolutionsEnam.P1440]}],
        }

        setDB(dataset1)

        const res = await req
            .get(SETTINGS.PATH.VIDEOS + '/2')
            .expect(404)

        console.log(res.body)
    })
})