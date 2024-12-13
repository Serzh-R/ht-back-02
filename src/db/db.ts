import {DBType, ResolutionsEnam, VideoTypes} from '../types/types';

export const video: VideoTypes = {
    id: Date.now() + Math.random(),
    title: 'back',
    author: 'serzh',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: new Date(Math.floor(Date.now() / 1000) * 1000).toISOString(),
    publicationDate: new Date(Math.floor((Date.now() + 86400000) / 1000) * 1000).toISOString(),
    availableResolutions: [ResolutionsEnam.P1440]
}

export const db: DBType = {
    videos: []
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB  = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
}