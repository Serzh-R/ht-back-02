
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
