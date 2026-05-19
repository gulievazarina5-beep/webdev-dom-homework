const host = 'https://wedev-api.sky.pro/api/v1/zarina-gulieva/comments'

export function getComments() {
    return fetch(host, {
        method: 'GET',
    }).then((response) => {
        return response.json()
    })
}

export function postComment({ name, text }) {
    return fetch(host, {
        method: 'POST',
        body: JSON.stringify({
            name: name,
            text: text,
        }),
    }).then((response) => {
        return response.json()
    })
}
