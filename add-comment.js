import { postComment } from './api.js'
import { sanitizeHtml } from './utils.js'

export const handleAddComment = ({
    nameInput,
    textInput,
    errorBlock,
    fetchAndRenderComments,
}) => {
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
