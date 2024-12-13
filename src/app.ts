import express, {Request, Response} from 'express'
import cors from 'cors'
import {HTTP_STATUSES, SETTINGS} from './settings';
import {videoRouter} from './videos/videoRouter';
import {db} from './db/db';

export const app = express()
app.use(express.json())
app.use(cors())
app.use(SETTINGS.PATH.VIDEOS, videoRouter)

app.delete('/testing/all-data', (req: Request, res: Response) => {

    db.videos = []

    res.status(HTTP_STATUSES.NO_CONTENT_204).send();
})

app.get('/', (req: Request, res: Response) => {
    res.status(HTTP_STATUSES.OK_200).json('Ciao Back-end!')
})
