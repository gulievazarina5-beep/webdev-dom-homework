import { getComments, postComment } from './api.js'
import { renderComments } from './render.js'
import { sanitizeHtml } from './utils.js'

const nameInput = document.getElementById('name-input')
const textInput = document.getElementById('text-input')
const addButton = document.querySelector('.add-form-button')
const listElement = document.querySelector('.comments')
const errorBlock = document.getElementById('error-block')

let comments = []

// Функция для получения данных и их отрисовки
const fetchAndRenderComments = () => {
    return getComments().then((responseData) => {
        comments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: new Date(comment.date),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            }
        })
        renderComments({ comments, listElement, textInputElement: textInput })
    })
}

// Первичная загрузка
fetchAndRenderComments()

// Функция добавления комментария, вынесенная в отдельный обработчик
const handleAddComment = () => {
    if (!nameInput.value.trim() || !textInput.value.trim()) {
        errorBlock.textContent = 'Заполните форму, пожалуйста'
        errorBlock.style.display = 'block'
        return
    }

    errorBlock.style.display = 'none'

    postComment({
        name: sanitizeHtml(nameInput.value),
        text: sanitizeHtml(textInput.value),
    })
        .then(() => {
            return fetchAndRenderComments()
        })
        .then(() => {
            nameInput.value = ''
            textInput.value = ''
        })
}

addButton.addEventListener('click', handleAddComment)

const hideError = () => {
    errorBlock.style.display = 'none'
}

nameInput.addEventListener('input', hideError)
textInput.addEventListener('input', hideError)
