import { fetchAndRenderComments, handleAddComment } from './handlers.js'

const nameInput = document.getElementById('name-input')
const textInput = document.getElementById('text-input')
const addButton = document.querySelector('.add-form-button')
const errorBlock = document.getElementById('error-block')

// Первоначальный запрос данных
fetchAndRenderComments()

// Главные обработчики формы
addButton.addEventListener('click', handleAddComment)

const hideError = () => {
    errorBlock.style.display = 'none'
}

nameInput.addEventListener('input', hideError)
textInput.addEventListener('input', hideError)
