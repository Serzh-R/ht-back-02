import {ResolutionsEnam} from '../types/types'

export const titleFieldValidator = (
    title: string | undefined | null,
    errorsArray: Array<{ message: string; field: string }>
) => {
    // Проверка на null, undefined или пустую строку
    if (!title || title.trim().length < 1) {
        errorsArray.push({
            message: 'no title',
            field: 'title',
        });
        return;
    }

    // Проверка на максимальную длину
    if (title.trim().length > 40) {
        errorsArray.push({
            message: 'more than 40 symbols',
            field: 'title',
        })
        return;
    }
};


export const authorFieldValidator = (
    author: string | undefined | null,
    errorsArray: Array<{ message: string; field: string }>
) => {
    // Проверка на null, undefined или пустую строку
    if (!author || author.trim().length < 1) {
        errorsArray.push({
            message: 'no author',
            field: 'author',
        });
        return;
    }

    // Проверка на максимальную длину
    if (author.trim().length > 20) {
        errorsArray.push({
            message: 'more than 20 symbols',
            field: 'author',
        })
        return;
    }
};

export const availableResolutionsFieldValidator = (
    availableResolutions: ResolutionsEnam[] | null | undefined,
    errorsArray: Array<{ message: string; field: string }>
) => {

    if (availableResolutions === null) {
        return
    }

    if (availableResolutions && availableResolutions.length) {
        availableResolutions.forEach((resolution: string) => {
            if (!Object.keys(ResolutionsEnam).includes(resolution)) {
                errorsArray.push({
                    message: 'exist not valid value',
                    field: 'availableResolutions'
                })
                return
            }
        })
    }
}

export const canBeDownloadedFieldValidator = (
    canBeDownloaded: boolean | undefined | null,
    errorsArray: Array<{ message: string; field: string }>
) => {
    if (canBeDownloaded === undefined || canBeDownloaded === null) {
        errorsArray.push({
            message: 'must be a boolean value',
            field: 'canBeDownloaded',
        });
        return;
    }

    if (typeof canBeDownloaded !== 'boolean') {
        errorsArray.push({
            message: 'must be a boolean value',
            field: 'canBeDownloaded',
        })
        return;
    }
};

export const minAgeRestrictionFieldValidator = (
    minAgeRestriction: number | null | undefined,
    errorsArray: Array<{message: string, field: string}>
) => {
    if (minAgeRestriction !== null && typeof minAgeRestriction !== 'number') {
        errorsArray.push({
            message: 'must be a number or null',
            field: 'minAgeRestriction'
        });
        return;
    }

    if (minAgeRestriction !== null && (minAgeRestriction < 1 || minAgeRestriction > 18)) {
        errorsArray.push({
            message: 'must be between 1 and 18 or null',
            field: 'minAgeRestriction'
        })
        return
    }
};

export const publicationDateFieldValidator = (
    publicationDate: string | undefined,
    errorsArray: Array<{message: string, field: string}>
) => {
    if (!publicationDate) {
        errorsArray.push({
            message: 'no publication date',
            field: 'publicationDate',
        });
        return
    }

    const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
    if (!isoDateRegex.test(publicationDate)) {
        errorsArray.push({
            message: 'must be in ISO 8601 format',
            field: 'publicationDate'
        })
        return
    }
};
