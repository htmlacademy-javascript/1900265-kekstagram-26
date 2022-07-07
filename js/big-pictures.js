import {isEscapeKey} from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImgElement = document.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const commentsCountElement = bigPicture.querySelector('.comments-count');
const socialCaptionElement = bigPicture.querySelector('.social__caption');
// const socialCommentCountElement = bigPicture.querySelector('.social__comment-count');
// const commentsLoaderElement = bigPicture.querySelector('.comments-loader');
const bodyElement = document.querySelector('body');
const cancelElement = bigPicture.querySelector('.big-picture__cancel');

const keydownEscapeHandler = (evt) => {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    bigPicture.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', keydownEscapeHandler);
  }
};

const clickHandler = () => {
  bigPicture.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  cancelElement.removeEventListener('click', clickHandler);
};

const MAX_RENDER_COMMENTS = 5;
const listSocialComments = document.querySelector('.social__comments');
const templateSocialComment = document.querySelector('.social__comment');

const renderSocialComment = (socialComments) => {
  document.querySelectorAll('.social__comment').forEach((item) => item.remove());
  const listSocialCommentsFragment = document.createDocumentFragment();

  socialComments.slice(0, MAX_RENDER_COMMENTS).forEach(({avatar, name, message}) => {
    const elementSocialComment = templateSocialComment.cloneNode(true);
    elementSocialComment.querySelector('.social__picture').src = avatar;
    elementSocialComment.querySelector('.social__picture').alt = name;
    elementSocialComment.querySelector('.social__text').textContent = message;
    listSocialCommentsFragment.appendChild(elementSocialComment);
  });
  listSocialComments.appendChild(listSocialCommentsFragment);
};

const renderBigPicture = (url, likes, comments, description) => {
  bigPicture.classList.remove('hidden');
  bigPictureImgElement.src = url;
  likesCountElement.textContent = likes;
  commentsCountElement.textContent = comments.length;
  socialCaptionElement.textContent = description;
  renderSocialComment(comments);
  // socialCommentCountElement.classList.add('hidden');
  // commentsLoaderElement.classList.add('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', keydownEscapeHandler);
  cancelElement.addEventListener('click', clickHandler);
};

export {renderBigPicture};
