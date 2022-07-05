import {isEscapeKey} from './utils.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadFile = uploadForm.querySelector('#upload-file');
const bodyElement = document.querySelector('body');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const textHashtagsElement = uploadForm.querySelector('.text__hashtags');
const textDescriptionElement = uploadForm.querySelector('.text__description');
const templateSuccess = document.querySelector('#success').content.querySelector('.success');
const templateError = document.querySelector('#error').content.querySelector('.error');
const uploadTextElement = document.querySelector('.img-upload__text');

const keydownEscapeHandler = (evt) => {
  if (isEscapeKey(evt)) {
    if (document.activeElement !== textHashtagsElement && document.activeElement !== textDescriptionElement) {
      evt.preventDefault();
      uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
      bodyElement.classList.remove('modal-open');
      document.removeEventListener('keydown', keydownEscapeHandler);
    }
  }
};

const clickHandler = () => {
  uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  uploadCancel.removeEventListener('click', clickHandler);
};

uploadFile.addEventListener('change', () => {
  document.addEventListener('keydown', keydownEscapeHandler);
  uploadCancel.addEventListener('click', clickHandler);
  uploadForm.querySelector('.img-upload__overlay').classList.remove('hidden');
  bodyElement.classList.add('modal-open');
});

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text'
});

const HASHTAG_RE = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const MAX_RENDER_HASHTAGS = 5;

const validateHashtag = (value) => {
  const words = value.trim().split(' ');
  const isValid = value === '' || words.every((word) => HASHTAG_RE.test(word)) && new Set(words).size === words.length && words.length <= MAX_RENDER_HASHTAGS;
  return isValid;
};

pristine.addValidator(textHashtagsElement, validateHashtag, 'ХэшТэг начинается с # и содержит не более 20 любых букв и цифр. Можно использовать не более 5 неповторяющихся ХэшТэгов.');

const renderModal = (templateModal) => {
  const elementModal = templateModal.cloneNode(true);
  elementModal.querySelector('button').addEventListener('click', () => elementModal.remove());
  uploadTextElement.appendChild(elementModal);
};

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    renderModal(templateSuccess);
  } else {
    renderModal(templateError);
  }
});
