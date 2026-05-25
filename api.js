const host = 'https://wedev-api.sky.pro/api/v1/zarina-gulieva/comments'

export function getComments() {
    return fetch(host, {
        method: 'GET',
    }).then((response) => {
        if (response.status === 500) {
            throw new Error('Сервер сломался')
        }
        return response.json()
    })
}

export function postComment({ name, text }) {
    return fetch(host, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            text: text,
            forceError: true, // Включено по ТЗ для симуляции 500-й ошибки сервера
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Плохой запрос')
        }
        if (response.status === 500) {
            throw new Error('Сервер сломался')
        }
        return response.json()
    })
}


