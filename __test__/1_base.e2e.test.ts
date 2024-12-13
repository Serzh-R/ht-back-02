import {req} from './test-helpers';

describe('/', () => {


    it('Should check base endpoint', async () => {
        const res = await req
            .get('/')
            .expect(200)

        console.log(res.status)
        console.log(res.body)
    })
})