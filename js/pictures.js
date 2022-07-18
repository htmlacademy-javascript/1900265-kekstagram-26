import {renderBigPicture} from './big-pictures.js';
import {getData} from './api.js';
import {showAlert} from './utils.js';
import {getRandomElements} from './utils.js';

const listPictures = document.querySelector('.pictures');
const templatePicture = document.querySelector('#picture').content.querySelector('.picture');
const imgFilters = document.querySelector('.img-filters');
const imgFiltersButtons = document.querySelectorAll('.img-filters__button');
const filterDefaultElement = document.querySelector('#filter-default');
const filterRandomElement = document.querySelector('#filter-random');
const filterDiscussedElement = document.querySelector('#filter-discussed');

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

const clearPictures = () => listPictures.querySelectorAll('.picture').forEach((item) => item.remove());

let defaultPictures;
const COUNT = 10;

const clearActiveFilterButton = () => imgFiltersButtons.forEach((item) => item.classList.remove('img-filters__button--active'));

filterDefaultElement.addEventListener('click', () => {
  clearPictures();
  renderPictures(defaultPictures);
  clearActiveFilterButton();
  filterDefaultElement.classList.add('img-filters__button--active');
});

filterRandomElement.addEventListener('click', () => {
  const randomIndexes = getRandomElements(defaultPictures.map((item) => item.id), COUNT);
  const randomPictures = randomIndexes.map((id) => defaultPictures[id]);
  clearPictures();
  renderPictures(randomPictures);
  clearActiveFilterButton();
  filterRandomElement.classList.add('img-filters__button--active');
});

let sortedPictures;

filterDiscussedElement.addEventListener('click', () => {
  if (!sortedPictures) {
    const sortedIndexes = defaultPictures
      .map((item) => ({id: item.id, commentCount: item.comments.length}))
      .sort((a, b) => b.commentCount - a.commentCount);
    sortedPictures = sortedIndexes.map((item) => defaultPictures[item.id]);
  }
  clearPictures();
  renderPictures(sortedPictures);
  clearActiveFilterButton();
  filterDiscussedElement.classList.add('img-filters__button--active');
});

const showFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');
  imgFilters.classList.add('img-filters--active');
};

getData(
  (pictures) => {
    // console.dir(pictures);
    defaultPictures = pictures;
    showFilters();
    renderPictures(defaultPictures);
  },
  () => showAlert('Ошибка соединения с сервером. Попробуйте ещё раз.'),
);

