export const renderComments = ({ comments, listElement, textInputElement }) => {
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

    const likeButtons = document.querySelectorAll('.like-button')
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', (event) => {
            event.stopPropagation()
            const index = likeButton.dataset.index
            const comment = comments[index]
            comment.likes = comment.isLiked
                ? comment.likes - 1
                : comment.likes + 1
            comment.isLiked = !comment.isLiked

            renderComments({ comments, listElement, textInputElement })
        })
    }

    const commentsElements = document.querySelectorAll('.comment')
    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', () => {
            const index = commentElement.dataset.index
            const currentComment = comments[index]
            textInputElement.value = `${currentComment.name}: ${currentComment.text}`
        })
    }
}
