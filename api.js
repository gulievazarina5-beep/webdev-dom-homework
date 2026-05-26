const host = 'https://wedev-api.sky.pro/api/v2/zarina-gulieva/comments';
const loginUrl = 'https://wedev-api.sky.pro/api/user/login';

// 1. Получение списка комментариев (GET)
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

// 2. Добавление комментария (POST)
export function postComment({ text, token }) {
    return fetch(host, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            text: text,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Комментарий должен быть не короче 3 символов')
        }
        if (response.status === 500) {
            throw new Error('Сервер сломался')
        }
        return response.json()
    })
}

// 3. Авторизация (POST) — строго по документации передаем login и password
export function loginUser({ login, password }) {
    return fetch(loginUrl, {
        method: 'POST',
        body: JSON.stringify({
            login: login,
            password: password,
        }),
    }).then((response) => {
        if (response.status === 400) {
            throw new Error('Неверный логин или пароль')
        }
        if (response.status === 500) {
            throw new Error('Сервер сломался')
        }
        return response.json()
    })
}
