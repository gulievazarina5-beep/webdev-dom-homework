import { getComments } from './api.js';
import { renderComments } from './render.js';
import { handleAddComment } from './add-comment.js'; // Импортируем новый модуль

const nameInput = document.getElementById('name-input');
const textInput = document.getElementById('text-input');
const addButton = document.querySelector('.add-form-button');
const listElement = document.querySelector('.comments');
const errorBlock = document.getElementById('error-block');

let comments = [];

const fetchAndRenderComments = () => {
    return getComments().then((responseData) => {
        comments = responseData.comments.map((comment) => {
            return {
                name: comment.author.name,
                date: new Date(comment.date),
                text: comment.text,
                likes: comment.likes,
                isLiked: false,
            };
        });
        renderComments({ comments, listElement, textInputElement: textInput });
    });
};

fetchAndRenderComments();

// Просто вызываем импортированную функцию
addButton.addEventListener('click', () => {
    handleAddComment({ 
        nameInput, 
        textInput, 
        errorBlock, 
        fetchAndRenderComments 
    });
});

const hideError = () => { errorBlock.style.display = 'none'; };
nameInput.addEventListener('input', hideError);
textInput.addEventListener('input', hideError);
