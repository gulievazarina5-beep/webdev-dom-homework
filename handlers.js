import { postComment } from './api.js'
import { sanitizeHtml } from './utils.js'
import { comments, setComments } from './store.js'
import { getComments } from './api.js'
import { renderComments } from './render.js'

// 1. Сценарий: Первоначальная загрузка приложения
export const fetchAndRenderComments = () => {
    const listElement = document.querySelector('.comments')

    const loadingCommentsEl = document.createElement('div')
    loadingCommentsEl.id = 'loading-comments'
    loadingCommentsEl.textContent = 'Пожалуйста, подождите, данные загружаются...'
    loadingCommentsEl.style.cssText = 'margin-bottom: 20px; font-size: 16px; color: #ffffff; text-align: center;'
    
    if (listElement) {
        listElement.before(loadingCommentsEl)
        listElement.style.display = 'none'
    }

    return getComments()
        .then((responseData) => {
            const transformedComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            })
            setComments(transformedComments)
            renderComments()
        })
        .catch((error) => {
            console.error("Ошибка при загрузке:", error)
            // Если сервер вернул 500 или упал с CORS-ошибкой
            if (error.message === 'Сервер сломался' || error.message.includes('fetch') || error.message.includes('type')) {
                alert('Сервер сломался, попробуй позже')
            } else {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            }
        })
        .finally(() => {
            const elToRemove = document.getElementById('loading-comments')
            if (elToRemove) elToRemove.remove()
            if (listElement) listElement.style.display = 'block' 
        })
}

// 2. Сценарий: Добавление нового комментария
export const handleAddComment = () => {
    const nameInput = document.getElementById('name-input')
    const textInput = document.getElementById('text-input')
    const errorBlock = document.getElementById('error-block')
    const addFormEl = document.querySelector('.add-form')

    const trimmedName = nameInput.value.trim()
    const trimmedText = textInput.value.trim()

    // Валидация по критериям: строка менее 3 символов
    if (trimmedName.length < 3 || trimmedText.length < 3) {
        alert('Имя и комментарий должны быть не короче 3 символов')
        return
    }

    if (errorBlock) errorBlock.style.display = 'none'

    const loadingFormEl = document.createElement('div')
    loadingFormEl.id = 'loading-form'
    loadingFormEl.textContent = 'Комментарий добавляется...'
    loadingFormEl.style.cssText = 'margin-top: 20px; font-size: 16px; color: #ffffff; text-align: center;'

    if (addFormEl) {
        addFormEl.before(loadingFormEl)
        addFormEl.style.display = 'none' // Скрываем форму через display по ТЗ
    }

    postComment({
        name: sanitizeHtml(nameInput.value),
        text: sanitizeHtml(textInput.value),
    })
        .then(() => {
            return getComments()
        })
        .then((responseData) => {
            const transformedComments = responseData.comments.map((comment) => {
                return {
                    name: comment.author.name,
                    date: new Date(comment.date),
                    text: comment.text,
                    likes: comment.likes,
                    isLiked: false,
                }
            })
            setComments(transformedComments)
            renderComments()
            
            // Данные затираются ТОЛЬКО в случае успеха
            nameInput.value = ''
            textInput.value = ''
        })
        .catch((error) => {
            console.error("Ошибка при добавлении:", error)
            
            // Расширенная проверка ошибок (учитывает CORS-блокировку браузера при 500 статусе)
            if (error.message === 'Плохой запрос') {
                alert('Имя и комментарий должны быть не короче 3 символов')
            } else if (error.message === 'Сервер сломался' || error.message.includes('fetch') || error.message.includes('type')) {
                alert('Сервер сломался, попробуй позже')
            } else {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            }
        })
        .finally(() => {
            const elToRemove = document.getElementById('loading-form')
            if (elToRemove) elToRemove.remove()
            if (addFormEl) addFormEl.style.display = 'flex' // Возвращаем форму обратно, текст внутри не потерян
        })
}

export const handleLikeClick = (event) => {
    event.stopPropagation()
    const index = event.target.dataset.index
    const comment = comments[index]

    comment.likes  = comment.isLiked ? comment.likes - 1 : comment.likes + 1
    comment.isLiked = !comment.isLiked

    renderComments()
}

export const handleCommentClick = (event) => {
    const commentElement = event.currentTarget
    const index = commentElement.dataset.index
    const currentComment = comments[index]
    const textInput = document.getElementById('text-input')

    textInput.value = `${currentComment.name}: ${currentComment.text}\n`
}
