import {isEscapeKey} from './utils.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadFile = uploadForm.querySelector('#upload-file');
const bodyElement = document.querySelector('body');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const textHashtagsElement = uploadForm.querySelector('.text__hashtags');
const textDescriptionElement = uploadForm.querySelector('.text__description');
const scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
const scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
const scaleControlValueElement = document.querySelector('.scale__control--value');

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;
const SCALE_DEFAULT = 100;

let scaleValue = SCALE_DEFAULT;
const showScaleValue = () => {
  scaleControlValueElement.value = `${scaleValue}%`;
};

const decreaseScale = () => {
  if (scaleValue >= SCALE_MIN + SCALE_STEP) {
    scaleValue -= SCALE_STEP;
    showScaleValue();
  }
};

const increaseScale = () => {
  if (scaleValue <= SCALE_MAX - SCALE_STEP) {
    scaleValue += SCALE_STEP;
    showScaleValue();
  }
};

const cleanForm = () => {
  scaleControlSmallerElement.removeEventListener('click', decreaseScale);
  scaleControlBiggerElement.removeEventListener('click', increaseScale);
  textHashtagsElement.value = '';
  textDescriptionElement.value = '';
  scaleValue = SCALE_DEFAULT;
  showScaleValue();
  pristine.reset();
};

const keydownEscapeHandler = (evt) => {
  if (isEscapeKey(evt)) {
    if (document.activeElement !== textHashtagsElement && document.activeElement !== textDescriptionElement) {
      evt.preventDefault();
      uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
      bodyElement.classList.remove('modal-open');
      document.removeEventListener('keydown', keydownEscapeHandler);
      cleanForm();
    }
  }
};

const clickHandler = () => {
  uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  uploadCancel.removeEventListener('click', clickHandler);
  cleanForm();
};

uploadFile.addEventListener('change', () => {
  scaleControlSmallerElement.addEventListener('click', decreaseScale);
  scaleControlBiggerElement.addEventListener('click', increaseScale);
  document.addEventListener('keydown', keydownEscapeHandler);
  uploadCancel.addEventListener('click', clickHandler);
  uploadForm.querySelector('.img-upload__overlay').classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  showScaleValue();
});

const HASHTAG_RE = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const MAX_RENDER_HASHTAGS = 5;

const validateHashtag = (value) => {
  const words = value.trim().split(' ');
  const isValid = value === '' || words.every((word) => HASHTAG_RE.test(word));
  return isValid;
};

const noRepeatHashtags = (value) => {
  const words = value.trim().toLowerCase().split(' ');
  const isValid = value === '' || new Set(words).size === words.length;
  return isValid;
};

const maxRenderHashtags = (value) => {
  const words = value.trim().split(' ');
  const isValid = value === '' || words.length <= MAX_RENDER_HASHTAGS;
  return isValid;
};

pristine.addValidator(textHashtagsElement, validateHashtag, 'ХэшТэг начинается с # и содержит не более 20 любых букв и цифр.');
pristine.addValidator(textHashtagsElement, noRepeatHashtags, 'ХэшТэги не должны повторяться.');
pristine.addValidator(textHashtagsElement, maxRenderHashtags, 'Можно использовать не более 5 ХэшТэгов.');

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    clickHandler();
  }
});

