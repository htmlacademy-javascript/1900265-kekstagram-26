import {isEscapeKey} from './utils.js';
import {sendData} from './api.js';
import {applyOriginalEffect} from './slider.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadFile = uploadForm.querySelector('#upload-file');
const bodyElement = document.querySelector('body');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const textHashtagsElement = uploadForm.querySelector('.text__hashtags');
const textDescriptionElement = uploadForm.querySelector('.text__description');
const scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
const scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
const scaleControlValueElement = document.querySelector('.scale__control--value');
const imgUploadPreviewElement = document.querySelector('.img-upload__preview img');
const submitButtonElement = document.querySelector('#upload-submit');
const effectNoneElement = document.querySelector('#effect-none');
const templateSuccess = document.querySelector('#success').content.querySelector('.success');
const templateError = document.querySelector('#error').content.querySelector('.error');
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_STEP = 25;
const SCALE_DEFAULT = 100;
const HASHTAG_RE = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;
const MAX_RENDER_HASHTAGS = 5;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

let scaleValue = SCALE_DEFAULT;

const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__error-text',
});

const applyScaleValue = () => {
  scaleControlValueElement.value = `${scaleValue}%`;
  imgUploadPreviewElement.style.transform = `scale(${scaleValue / 100})`;
};

const decreaseScale = () => {
  if (scaleValue >= SCALE_MIN + SCALE_STEP) {
    scaleValue -= SCALE_STEP;
    applyScaleValue();
  }
};

const increaseScale = () => {
  if (scaleValue <= SCALE_MAX - SCALE_STEP) {
    scaleValue += SCALE_STEP;
    applyScaleValue();
  }
};

const resetForm = () => {
  textHashtagsElement.value = '';
  textDescriptionElement.value = '';
  scaleValue = SCALE_DEFAULT;
  applyScaleValue();
  pristine.reset();
  effectNoneElement.checked = true;
  applyOriginalEffect();
};

const closeForm = (isReset) => {
  uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', keydownEscapeHandler);
  uploadCancel.removeEventListener('click', clickHandler);
  scaleControlSmallerElement.removeEventListener('click', decreaseScale);
  scaleControlBiggerElement.removeEventListener('click', increaseScale);
  if (isReset) {
    resetForm();
  }
};

function keydownEscapeHandler(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement !== textHashtagsElement && document.activeElement !== textDescriptionElement) {
      evt.preventDefault();
      closeForm(true);
    }
  }
}

function clickHandler() {
  closeForm(true);
}

const validateHashtag = (value) => {
  const words = value.trim().split(' ');
  const isValid = value === '' || words.every((word) => HASHTAG_RE.test(word));
  return isValid;
};

const validateHashtagRepeats = (value) => {
  const words = value.trim().toLowerCase().split(' ');
  const isValid = value === '' || new Set(words).size === words.length;
  return isValid;
};

const validateHashtagCount = (value) => {
  const words = value.trim().split(' ');
  const isValid = value === '' || words.length <= MAX_RENDER_HASHTAGS;
  return isValid;
};

pristine.addValidator(textHashtagsElement, validateHashtag, 'ХэшТэг начинается с # и содержит не более 20 любых букв и цифр.');
pristine.addValidator(textHashtagsElement, validateHashtagRepeats, 'ХэшТэги не должны повторяться.');
pristine.addValidator(textHashtagsElement, validateHashtagCount, 'Можно использовать не более 5 ХэшТэгов.');

const blockSubmitButton = () => {submitButtonElement.disabled = true;};
const unblockSubmitButton = () => {submitButtonElement.disabled = false;};

const showSuccess = () => {
  const elementSuccess = templateSuccess.cloneNode(true);
  elementSuccess.querySelector('.success__button').addEventListener('click', () => elementSuccess.remove());
  function keydownEscapeSuccessHandler(evt) {
    if (isEscapeKey(evt)) {
      elementSuccess.remove();
      document.removeEventListener('keydown', keydownEscapeSuccessHandler);
      document.removeEventListener('click', clickSuccessHandler);
    }
  }
  document.addEventListener('keydown', keydownEscapeSuccessHandler);
  function clickSuccessHandler() {
    elementSuccess.remove();
    document.removeEventListener('click', clickSuccessHandler);
    document.removeEventListener('keydown', keydownEscapeSuccessHandler);
  }
  document.addEventListener('click', clickSuccessHandler);
  bodyElement.appendChild(elementSuccess);
};

const showForm = () => {
  scaleControlSmallerElement.addEventListener('click', decreaseScale);
  scaleControlBiggerElement.addEventListener('click', increaseScale);
  document.addEventListener('keydown', keydownEscapeHandler);
  uploadCancel.addEventListener('click', clickHandler);
  uploadForm.querySelector('.img-upload__overlay').classList.remove('hidden');
  bodyElement.classList.add('modal-open');
};

const showError = () => {
  const elementError = templateError.cloneNode(true);
  elementError.querySelector('.error__button').addEventListener('click', () => {
    elementError.remove();
    showForm();
  });
  function keydownEscapeErrorHandler(evt) {
    if (isEscapeKey(evt)) {
      elementError.remove();
      showForm();
      document.removeEventListener('keydown', keydownEscapeErrorHandler);
      document.removeEventListener('click', clickErrorHandler);
    }
  }
  document.addEventListener('keydown', keydownEscapeErrorHandler);
  function clickErrorHandler() {
    elementError.remove();
    document.removeEventListener('click', clickErrorHandler);
    document.removeEventListener('keydown', keydownEscapeErrorHandler);
    showForm();
  }
  document.addEventListener('click', clickErrorHandler);
  bodyElement.appendChild(elementError);
};

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    blockSubmitButton();
    sendData(
      new FormData(evt.target),
      () => {
        unblockSubmitButton();
        closeForm(true);
        showSuccess();
      },
      () => {
        unblockSubmitButton();
        closeForm(false);
        showError();
      },
    );
  }
});

const userUploadFile = () => {
  const userFile = uploadFile.files[0];
  const userFileName = userFile.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => userFileName.endsWith(it));
  if (matches) {
    imgUploadPreviewElement.src = URL.createObjectURL(userFile);
  }
};

uploadFile.addEventListener('change', () => {
  showForm();
  userUploadFile();
  applyScaleValue();
  applyOriginalEffect();
});

uploadFile.addEventListener('click', (evt) => {
  evt.target.value = '';
});
