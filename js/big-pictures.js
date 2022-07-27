import {isEscapeKey} from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImgElement = document.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const commentsCountElement = bigPicture.querySelector('.comments-count');
const socialCaptionElement = bigPicture.querySelector('.social__caption');
const loadedCommentsCountElement = bigPicture.querySelector('.loaded-comments-count');
const commentsLoaderElement = bigPicture.querySelector('.comments-loader');
const bodyElement = document.querySelector('body');
const cancelElement = bigPicture.querySelector('.big-picture__cancel');
const listSocialComments = document.querySelector('.social__comments');
const templateSocialComment = document.querySelector('.social__comment');
const COMMENTS_LIMIT = 5;

let renderMoreCommentsHandler;
let commentOffset;

function keydownEscapeHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    bigPicture.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', keydownEscapeHandler);
    cancelElement.removeEventListener('click', clickHandler);
    commentsLoaderElement.removeEventListener('click', renderMoreCommentsHandler);
  }
}

function clickHandler() {
  bigPicture.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  cancelElement.removeEventListener('click', clickHandler);
  document.removeEventListener('keydown', keydownEscapeHandler);
  commentsLoaderElement.removeEventListener('click', renderMoreCommentsHandler);
}

const renderSocialComment = (socialComments) => {
  const listSocialCommentsFragment = document.createDocumentFragment();
  loadedCommentsCountElement.textContent = Math.min(socialComments.length, commentOffset + COMMENTS_LIMIT);
  socialComments.slice(commentOffset, commentOffset + COMMENTS_LIMIT).forEach(({avatar, name, message}) => {
    const elementSocialComment = templateSocialComment.cloneNode(true);
    elementSocialComment.querySelector('.social__picture').src = avatar;
    elementSocialComment.querySelector('.social__picture').alt = name;
    elementSocialComment.querySelector('.social__text').textContent = message;
    listSocialCommentsFragment.appendChild(elementSocialComment);
  });
  listSocialComments.appendChild(listSocialCommentsFragment);
  if (commentOffset + COMMENTS_LIMIT >= socialComments.length) {
    commentsLoaderElement.classList.add('hidden');
  }
};

const renderMoreComments = (comments) => {
  commentOffset += COMMENTS_LIMIT;
  renderSocialComment(comments);
};

const renderBigPicture = (url, likes, comments, description) => {
  bigPicture.classList.remove('hidden');
  commentsLoaderElement.classList.remove('hidden');
  bigPictureImgElement.src = url;
  likesCountElement.textContent = likes;
  commentsCountElement.textContent = comments.length;
  socialCaptionElement.textContent = description;
  document.querySelectorAll('.social__comment').forEach((item) => item.remove());
  commentOffset = 0;
  renderSocialComment(comments);
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', keydownEscapeHandler);
  cancelElement.addEventListener('click', clickHandler);
  renderMoreCommentsHandler = () => renderMoreComments(comments);
  commentsLoaderElement.addEventListener('click', renderMoreCommentsHandler);
};

export {renderBigPicture};
