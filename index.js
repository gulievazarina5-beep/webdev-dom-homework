import { sanitizeHtml } from './utils.js'
import { renderComments } from './render.js'

const nameInput = document.getElementById('name-input')
const textInput = document.getElementById('text-input')
const addButton = document.querySelector('.add-form-button')
const listElement = document.querySelector('.comments')
const errorBlock = document.getElementById('error-block')

let comments = []

const fetchAndRenderComments = () => {
    return fetch('https://wedev-api.sky.pro/api/v1/zarina-gulieva/comments', {
        method: 'GET',
    })
        .then((response) => {
            return response.json()
        })
        .then((responseData) => {
            const appComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false, 
                }
            })

            comments = appComments
            renderComments({
                comments,
                listElement,
                textInputElement: textInput,
            })
        })
}

fetchAndRenderComments()

addButton.addEventListener('click', () => {
    if (!nameInput.value.trim() || !textInput.value.trim()) {
        errorBlock.textContent = 'Заполните форму, пожалуйста'
        errorBlock.style.display = 'block'
        return
    }

    errorBlock.style.display = 'none'

    fetch('https://wedev-api.sky.pro/api/v1/zarina-gulieva/comments', {
        method: 'POST',
        body: JSON.stringify({
            name: sanitizeHtml(nameInput.value),
            text: sanitizeHtml(textInput.value),
        }),
    })
        .then((response) => {
            return response.json()
        })
        .then(() => {
            return fetchAndRenderComments()
        })
        .then(() => {
            nameInput.value = ''
            textInput.value = ''
        })
})

const hideError = () => {
    errorBlock.style.display = 'none'
}

nameInput.addEventListener('input', hideError)
textInput.addEventListener('input', hideError)
