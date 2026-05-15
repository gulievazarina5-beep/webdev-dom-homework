import { postComment } from './api.js'
import { sanitizeHtml } from './utils.js'
import { comments, setComments } from './store.js'
import { getComments } from './api.js'
import { renderComments } from './render.js'

// 1. Сценарий: Первоначальная загрузка приложения
export const fetchAndRenderComments = () => {
    const listElement = document.querySelector('.comments')

    // Создаем лоадер с белым цветом текста, чтобы его было видно на темном фоне
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
            console.error("Ошибка при получении комментариев:", error)
            alert("Сервер упал или пропал интернет. Попробуйте обновить страницу еще раз.")
        })
        .finally(() => {
            // Удаляем динамический лоадер
            const elToRemove = document.getElementById('loading-comments')
            if (elToRemove) elToRemove.remove()
            
            // Возвращаем исходный стиль отображения для списка комментариев
            if (listElement) listElement.style.display = 'block' 
        })
}

// 2. Сценарий: Добавление нового комментария
export const handleAddComment = () => {
    const nameInput = document.getElementById('name-input')
    const textInput = document.getElementById('text-input')
    const errorBlock = document.getElementById('error-block')
    const addFormEl = document.querySelector('.add-form')

    if (!nameInput.value.trim() || !textInput.value.trim()) {
        errorBlock.textContent = 'Заполните форму, пожалуйста'
        errorBlock.style.display = 'block'
        return
    }

    errorBlock.style.display = 'none'

    // Лоадер для формы с белым цветом текста
    const loadingFormEl = document.createElement('div')
    loadingFormEl.id = 'loading-form'
    loadingFormEl.textContent = 'Комментарий добавляется...'
    loadingFormEl.style.cssText = 'margin-top: 20px; font-size: 16px; color: #ffffff; text-align: center;'

    if (addFormEl) {
        addFormEl.before(loadingFormEl)
        addFormEl.style.display = 'none'
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
            
            nameInput.value = ''
            textInput.value = ''
        })
        .catch((error) => {
            console.error("Ошибка при добавлении комментария:", error)
            alert("Не удалось добавить комментарий. Сервер перегружен, повторите попытку.")
        })
        .finally(() => {
            // Возвращаем форму обратно на экран
            const elToRemove = document.getElementById('loading-form')
            if (elToRemove) elToRemove.remove()
            if (addFormEl) addFormEl.style.display = 'flex'
        })
}

// Обработчик клика по лайку
export const handleLikeClick = (event) => {
    event.stopPropagation()
    const index = event.target.dataset.index
    const comment = comments[index]

    comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1
    comment.isLiked = !comment.isLiked

    renderComments()
}

// Обработчик клика по комментарию (ответ)
export const handleCommentClick = (event) => {
    const commentElement = event.currentTarget
    const index = commentElement.dataset.index
    const currentComment = comments[index]
    const textInput = document.getElementById('text-input')

    textInput.value = `${currentComment.name}: ${currentComment.text}\n`
}
