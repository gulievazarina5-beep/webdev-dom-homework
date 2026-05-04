import { sanitizeHtml } from './utils.js'
import { renderComments } from './render.js'

const nameInput = document.getElementById('name-input')
const textInput = document.getElementById('text-input')
const addButton = document.querySelector('.add-form-button')
const listElement = document.querySelector('.comments')

const comments = [
    {
        name: 'Глеб Фокин',
        date: new Date(),
        text: 'Это будет первый комментарий на странице',
        likes: 3,
        isLiked: false,
    },
    {
        name: 'Варвара.Н',
        date: new Date(),
        text: 'Мне нравится как оформлена эта страница! ❤',
        likes: 75,
        isLiked: true,
    },
]

renderComments({ comments, listElement, textInputElement: textInput })

addButton.addEventListener('click', () => {
    if (!nameInput.value || !textInput.value) {
        console.error('Заполните форму')
        return
    }

    comments.push({
        name: sanitizeHtml(nameInput.value),
        date: new Date(),
        text: sanitizeHtml(textInput.value),
        likes: 0,
        isLiked: false,
    })

    renderComments({ comments, listElement, textInputElement: textInput })

    nameInput.value = ''
    textInput.value = ''
})
