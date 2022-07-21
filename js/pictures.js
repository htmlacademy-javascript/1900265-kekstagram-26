import {renderBigPicture} from './big-pictures.js';
import {getData} from './api.js';
import {showAlert, getRandomElements, debounce} from './utils.js';

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
const RERENDER_DELAY = 500;

const clearActiveFilterButton = () => imgFiltersButtons.forEach((item) => item.classList.remove('img-filters__button--active'));

const filterDefaultClick = () => {
  clearPictures();
  renderPictures(defaultPictures);
  clearActiveFilterButton();
  filterDefaultElement.classList.add('img-filters__button--active');
};

filterDefaultElement.addEventListener('click', debounce(filterDefaultClick, RERENDER_DELAY));

const filterRandomClick = () => {
  const randomIndexes = getRandomElements(defaultPictures.map((item) => item.id), COUNT);
  const randomPictures = randomIndexes.map((id) => defaultPictures[id]);
  clearPictures();
  renderPictures(randomPictures);
  clearActiveFilterButton();
  filterRandomElement.classList.add('img-filters__button--active');
};

filterRandomElement.addEventListener('click', debounce(filterRandomClick, RERENDER_DELAY));

let sortedPictures;

const filterDiscussedClick = () => {
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
};

filterDiscussedElement.addEventListener('click', debounce(filterDiscussedClick, RERENDER_DELAY));

const showFilters = () => {
  imgFilters.classList.remove('img-filters--inactive');
  imgFilters.classList.add('img-filters--active');
};

getData(
  (pictures) => {
    defaultPictures = pictures;
    showFilters();
    renderPictures(defaultPictures);
  },
  () => showAlert('Ошибка соединения с сервером. Попробуйте ещё раз.'),
);
