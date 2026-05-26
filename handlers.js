import { postComment } from './api.js'
import { sanitizeHtml } from './utils.js'
import { comments, setComments, token } from './store.js'
import { getComments } from './api.js'
import { renderComments } from './render.js'

export const fetchAndRenderComments = () => {
    const listElement = document.querySelector('.comments')
    const appElement = document.querySelector('#app')

    const loadingCommentsEl = document.createElement('div')
    loadingCommentsEl.id = 'loading-comments'
    loadingCommentsEl.textContent = 'Пожалуйста, подождите, данные загружаются...'
    loadingCommentsEl.style.cssText = 'margin-bottom: 20px; font-size: 16px; color: #ffffff; text-align: center;'
    
    if (listElement) {
        listElement.before(loadingCommentsEl)
        listElement.style.display = 'none'
    } else if (appElement) {
        appElement.appendChild(loadingCommentsEl)
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
            if (error.message === 'Сервер сломался') {
                alert('Сервер сломался, попробуй позже')
            } else {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            }
        })
        .finally(() => {
            const elToRemove = document.getElementById('loading-comments')
            if (elToRemove) elToRemove.remove()
            const currentListElement = document.querySelector('.comments')
            if (currentListElement) currentListElement.style.display = 'block' 
        })
}

export const handleAddComment = () => {
    const textInput = document.getElementById('text-input')
    const errorBlock = document.getElementById('error-block')
    const addFormEl = document.querySelector('.add-form')

    if (errorBlock) errorBlock.style.display = 'none'

    if (!textInput.value.trim()) {
        if (errorBlock) {
            errorBlock.textContent = 'Комментарий не может быть пустым'
            errorBlock.style.display = 'block'
        }
        return
    }

    const loadingFormEl = document.createElement('div')
    loadingFormEl.id = 'loading-form'
    loadingFormEl.textContent = 'Комментарий добавляется...'
    loadingFormEl.style.cssText = 'margin-top: 20px; font-size: 16px; color: #ffffff; text-align: center;'

    if (addFormEl) {
        addFormEl.before(loadingFormEl)
        addFormEl.style.display = 'none' 
    }

    postComment({
        text: sanitizeHtml(textInput.value),
        token: token,
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
            textInput.value = ''
        })
        .catch((error) => {
            console.error("Ошибка при добавлении:", error)
            
            if (error.message === 'Плохой запрос') {
                alert('Комментарий должен быть не короче 3 символов')
            } else if (error.message === 'Сервер сломался') {
                alert('Сервер сломался, попробуй позже')
            } else {
                alert('Кажется, у вас сломался интернет, попробуйте позже')
            }
        })
        .finally(() => {
            const elToRemove = document.getElementById('loading-form')
            if (elToRemove) elToRemove.remove()
            const currentAddFormEl = document.querySelector('.add-form')
            if (currentAddFormEl) currentAddFormEl.style.display = 'flex' 
        })
}

export const handleLikeClick = (event) => {
    event.stopPropagation()
    
    const buttonElement = event.currentTarget
    const index = buttonElement.dataset.index
    const comment = comments[index]

    if (!comment) return 

    comment.likes = comment.isLiked ? comment.likes - 1 : comment.likes + 1
    comment.isLiked = !comment.isLiked

    renderComments()
}

export const handleCommentClick = (event) => {
    const textInput = document.getElementById('text-input')
    
    if (!textInput) return 

    const commentElement = event.currentTarget
    const index = commentElement.dataset.index
    const currentComment = comments[index]

    if (currentComment) {
        textInput.value = `${currentComment.name}: ${currentComment.text}\n`
    }
}
