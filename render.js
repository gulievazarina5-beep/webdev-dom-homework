import { comments } from './store.js'
import { handleLikeClick, handleCommentClick } from './handlers.js'

export const renderComments = () => {
    const listElement = document.querySelector('.comments')

    const commentsHtml = comments
        .map((comment, index) => {
            return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${comment.date.toLocaleDateString()}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button ${
                comment.isLiked ? '-active-like' : ''
            }"></button>
          </div>
        </div>
      </li>`
        })
        .join('')

    listElement.innerHTML = commentsHtml

    // Навешиваем обработчики лайков из модуля handlers
    const likeButtons = document.querySelectorAll('.like-button')
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', handleLikeClick)
    }

    // Навешиваем обработчики ответов из модуля handlers
    const commentsElements = document.querySelectorAll('.comment')
    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', handleCommentClick)
    }
}
