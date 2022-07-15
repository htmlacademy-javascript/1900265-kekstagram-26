import {renderBigPicture} from './big-pictures.js';
import {getData} from './api.js';

const listPictures = document.querySelector('.pictures');
const templatePicture = document.querySelector('#picture').content.querySelector('.picture');

const renderPictures = (pictures) => {
  const listPicturesFragment = document.createDocumentFragment();
  pictures.forEach(({likes, url, comments, description}) => {
    const elementPicture = templatePicture.cloneNode(true);
    elementPicture.querySelector('.picture__likes').textContent = likes;
    elementPicture.querySelector('.picture__img').src = url;
    elementPicture.querySelector('.picture__comments').textContent = comments.length;
    elementPicture.addEventListener('click', () => {
      renderBigPicture(url, likes, comments, description);
    }
    );
    listPicturesFragment.appendChild(elementPicture);
  });
  listPictures.appendChild(listPicturesFragment);
};

getData(renderPictures);
