/*
2. Для отображения окна нужно удалять класс hidden у элемента .big-picture и каждый раз заполнять его данными о конкретной фотографии:
  - Адрес изображения url подставьте как src изображения внутри блока .big-picture__img.
  - Количество лайков likes подставьте как текстовое содержание элемента .likes-count.
  - Количество комментариев comments подставьте как текстовое содержание элемента .comments-count.
  - Список комментариев под фотографией: комментарии должны вставляться в блок .social__comments.
    Разметка каждого комментария должна выглядеть так:
    <li class="social__comment">
        <img
            class="social__picture"
            src="{{аватар}}"
            alt="{{имя комментатора}}"
            width="35" height="35">
        <p class="social__text">{{текст комментария}}</p>
    </li>
  - Описание фотографии description вставьте строкой в блок .social__caption.

3. После открытия окна спрячьте блоки счётчика комментариев .social__comment-count и загрузки новых комментариев .comments-loader,
добавив им класс hidden, с ними мы разберёмся позже, в другом домашнем задании.

4. После открытия окна добавьте тегу <body> класс modal-open, чтобы контейнер с фотографиями позади не прокручивался при скролле.
При закрытии окна не забудьте удалить этот класс.

5. Напишите код для закрытия окна по нажатию клавиши Esc и клике по иконке закрытия.
*/
import {isEscapeKey} from './utils.js';

const bigPicture = document.querySelector('.big-picture');
const bigPictureImgElement = document.querySelector('.big-picture__img img');
const likesCountElement = bigPicture.querySelector('.likes-count');
const commentsCountElement = bigPicture.querySelector('.comments-count');
const socialCaptionElement = bigPicture.querySelector('.social__caption');
const socialCommentCountElement = bigPicture.querySelector('.social__comment-count');
const commentsLoaderElement = bigPicture.querySelector('.comments-loader');
const bodyElement = document.querySelector('body');
const cancelElement = bigPicture.querySelector('.big-picture__cancel');

function keydownEscapeHandler(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    bigPicture.classList.add('hidden');
    bodyElement.classList.remove('modal-open');
    document.removeEventListener('keydown', keydownEscapeHandler);
  }
}

function clickHandler() {
  bigPicture.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  cancelElement.removeEventListener('click', clickHandler);
}

function renderBigPicture(url, likes, comments, description) {
  bigPicture.classList.remove('hidden');
  bigPictureImgElement.src = url;
  likesCountElement.textContent = likes;
  commentsCountElement.textContent = comments.length;
  socialCaptionElement.textContent = description;
  renderSocialComment(comments);
  socialCommentCountElement.classList.add('hidden');
  commentsLoaderElement.classList.add('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', keydownEscapeHandler);
  cancelElement.addEventListener('click', clickHandler);
}

const MAX_RENDER_COMMENTS = 5;
const listSocialComments = document.querySelector('.social__comments');
const templateSocialComment = document.querySelector('.social__comment');

function renderSocialComment(socialComments) {
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
}

export {renderBigPicture};
