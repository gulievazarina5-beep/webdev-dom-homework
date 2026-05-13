import { postComment } from './api.js'
import { sanitizeHtml } from './utils.js'
import { comments, setComments } from './store.js'
import { getComments } from './api.js'
import { renderComments } from './render.js'

// Функция загрузки и отрисовки, теперь без параметров
export const fetchAndRenderComments = () => {
    return getComments().then((responseData) => {
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
}

// Обработчик добавления комментария
export const handleAddComment = () => {
    const nameInput = document.getElementById('name-input')
    const textInput = document.getElementById('text-input')
    const errorBlock = document.getElementById('error-block')

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
