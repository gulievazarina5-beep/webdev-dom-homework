import { comments, token, userName, setToken, setUserName } from './store.js'
import { handleLikeClick, handleCommentClick, handleAddComment, fetchAndRenderComments } from './handlers.js'
import { loginUser } from './api.js'

export const renderComments = () => {
    const appElement = document.querySelector('#app')

    if (!appElement) {
        console.error("Элемент #app не найден на странице!");
        return;
    }

    const commentsHtml = comments
        .map((comment, index) => {
            const svgIcon = comment.isLiked 
                ? `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://w3.org"><path d="M15.95 0C14.036 0 12.199 0.882834 11 2.26703C9.801 0.882834 7.964 0 6.05 0C2.662 0 0 2.6267 0 5.99455C0 10.1035 3.74 13.4714 9.405 18.5613L11 20L12.595 18.5613C18.26 13.4714 22 10.1035 22 5.99455C22 2.6267 19.338 0 15.95 0Z" fill="#BCEC30"/></svg>`
                : `<svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://w3.org"><path d="M11.11 16.9482L11 17.0572L10.879 16.9482C5.654 12.2507 2.2 9.14441 2.2 5.99455C2.2 3.81471 3.85 2.17984 6.05 2.17984C7.744 2.17984 9.394 3.26975 9.977 4.75204H12.023C12.606 3.26975 14.256 2.17984 15.95 2.17984C18.15 2.17984 19.8 3.81471 19.8 5.99455C19.8 9.14441 16.346 12.2507 11.11 16.9482ZM15.95 0C14.036 0 12.199 0.882834 11 2.26703C9.801 0.882834 7.964 0 6.05 0C2.662 0 0 2.6267 0 5.99455C0 10.1035 3.74 13.4714 9.405 18.5613L11 20L12.595 18.5613C18.26 13.4714 22 10.1035 22 5.99455C22 2.6267 19.338 0 15.95 0Z" fill="#BCEC30"/></svg>`;

            const commentDate = typeof comment.date === 'string' ? new Date(comment.date) : comment.date;

            return `
      <li class="comment" data-index="${index}">
        <div class="comment-header">
          <div>${comment.name}</div>
          <div>${commentDate.toLocaleDateString()}</div>
        </div>
        <div class="comment-body">
          <div class="comment-text">${comment.text}</div>
        </div>
        <div class="comment-footer">
          <div class="likes">
            <span class="likes-counter">${comment.likes}</span>
            <button data-index="${index}" class="like-button">${svgIcon}</button>
          </div>
        </div>
      </li>`
        })
        .join('')

    let bottomHtml = ''
    if (!token) {
        bottomHtml = `<p class="auth-text" style="text-align: center; margin-top: 20px;">Чтобы добавить комментарий, <span id="auth-link" style="cursor:pointer; text-decoration:underline; color: #BCEC30;">авторизуйтесь</span></p>`
    } else {
        bottomHtml = `
        <div class="add-form">
          <input type="text" id="name-input" class="add-form-name" value="${userName}" readonly />
          <textarea type="textarea" id="text-input" class="add-form-text" placeholder="Введите ваш комментарий" rows="4"></textarea>
          <div class="add-form-row">
            <button class="add-form-button">Написать</button>
          </div>
          <div id="error-block" style="color: red; display: none; margin-top: 10px;"></div>
        </div>`
    }

    appElement.innerHTML = `
      <ul class="comments" style="display: block;">${commentsHtml}</ul>
      ${bottomHtml}
    `

    const likeButtons = document.querySelectorAll('.like-button')
    for (const likeButton of likeButtons) {
        likeButton.addEventListener('click', handleLikeClick)
    }

    const commentsElements = document.querySelectorAll('.comment')
    for (const commentElement of commentsElements) {
        commentElement.addEventListener('click', handleCommentClick)
    }

    if (!token) {
        document.getElementById('auth-link').addEventListener('click', renderLoginComponent)
    } else {
        const addButton = document.querySelector('.add-form-button')
        addButton.addEventListener('click', handleAddComment)

        const textInput = document.getElementById('text-input')
        const errorBlock = document.getElementById('error-block')
        textInput.addEventListener('input', () => {
            errorBlock.style.display = 'none'
        })
    }
}

function renderLoginComponent() {
    const appElement = document.querySelector('#app')

    appElement.innerHTML = `
      <div class="login-form" style="display: flex; flex-direction: column; gap: 10px; max-width: 360px; margin: 50px auto; padding: 20px; background-color: #202020; border-radius: 8px;">
        <h3 style="text-align: center; color: #ffffff; margin-bottom: 10px;">Форма входа</h3>
        <input type="text" id="login-input" class="add-form-name" style="width: 100%; margin: 0;" placeholder="Введите логин" />
        <input type="password" id="password-input" class="add-form-name" style="width: 100%; margin: 0;" placeholder="Введите пароль" />
        <button id="login-btn" class="add-form-button" style="width: 100%; margin-top: 10px;">Войти</button>
        <div id="login-error" style="color: #ff6b6b; text-align: center; margin-top: 5px;"></div>
      </div>
    `

    document.getElementById('login-btn').addEventListener('click', () => {
        const loginValue = document.getElementById('login-input').value
        const passwordValue = document.getElementById('password-input').value
        const errorBlock = document.getElementById('login-error')

        if (!loginValue || !passwordValue) {
            errorBlock.textContent = 'Заполните все поля!'
            return
        }

        loginUser({ login: loginValue, password: passwordValue })
            .then((responseData) => {
                // Защитная проверка: если сервер ответил ошибкой, не ломаем код
                if (!responseData || !responseData.user) {
                    throw new Error('Неверный логин или пароль')
                }
                
                setToken(responseData.user.token)
                setUserName(responseData.user.name)
                fetchAndRenderComments()
            })
            .catch((error) => {
                errorBlock.textContent = error.message
            })
    })
}
