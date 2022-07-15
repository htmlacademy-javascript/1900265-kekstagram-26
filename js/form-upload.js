import {isEscapeKey} from './utils.js';
import {sendData} from './api.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadFile = uploadForm.querySelector('#upload-file');
const bodyElement = document.querySelector('body');
const uploadCancel = uploadForm.querySelector('#upload-cancel');
const textHashtagsElement = uploadForm.querySelector('.text__hashtags');
const textDescriptionElement = uploadForm.querySelector('.text__description');
const scaleControlSmallerElement = document.querySelector('.scale__control--smaller');
const scaleControlBiggerElement = document.querySelector('.scale__control--bigger');
const scaleControlValueElement = document.querySelector('.scale__control--value');
const imgUploadPreviewElement = document.querySelector('.img-upload__preview').querySelector('img');
const submitButtonElement = document.querySelector('#upload-submit');
const effectNoneElement = document.querySelector('#effect-none');
const templateSuccess = document.querySelector('#success').content.querySelector('.success');
const templateError = document.querySelector('#error').content.querySelector('.error');

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

const cleanForm = () => {
  textHashtagsElement.value = '';
  textDescriptionElement.value = '';
  scaleValue = SCALE_DEFAULT;
  applyScaleValue();
  pristine.reset();
  effectNoneElement.checked = true;
  currentEffect = EFFECT_ORIGINAL;
  applyEffect();
};

const closeForm = (clean) => {
  uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', keydownEscapeHandler);
  uploadCancel.removeEventListener('click', clickHandler);
  scaleControlSmallerElement.removeEventListener('click', decreaseScale);
  scaleControlBiggerElement.removeEventListener('click', increaseScale);
  if (clean) {
    cleanForm();
  }
};

const keydownEscapeHandler = (evt) => {
  if (isEscapeKey(evt)) {
    if (document.activeElement !== textHashtagsElement && document.activeElement !== textDescriptionElement) {
      evt.preventDefault();
      closeForm(true);
    }
  }
};

const clickHandler = (clean) => closeForm(true);

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

const blockSubmitButton = () => {submitButtonElement.disabled = true;};
const unblockSubmitButton = () => {submitButtonElement.disabled = false;};


const showSuccess = () => {
  const elementSuccess = templateSuccess.cloneNode(true);
  elementSuccess.querySelector('.success__button').addEventListener('click', () => elementSuccess.remove());
  const keydownEscapeSuccessHandler = (evt) => {
    if (isEscapeKey(evt)) {
      elementSuccess.remove();
      document.removeEventListener('keydown', keydownEscapeSuccessHandler);
    }
  };
  document.addEventListener('keydown', keydownEscapeSuccessHandler);
  const clickSuccessHandler = (evt) => {
    elementSuccess.remove();
    document.removeEventListener('click', clickSuccessHandler);
  };
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
  const keydownEscapeErrorHandler = (evt) => {
    if (isEscapeKey(evt)) {
      elementError.remove();
      showForm();
      document.removeEventListener('keydown', keydownEscapeErrorHandler);
    }
  };
  document.addEventListener('keydown', keydownEscapeErrorHandler);
  const clickErrorHandler = (evt) => {
    elementError.remove();
    document.removeEventListener('click', clickErrorHandler);
    showForm();
  };
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

//слайдер

const sliderElement = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsRadioList = document.querySelectorAll('.effects__radio');
const effectsListElement = document.querySelector('.effects__list');
const EFFECT_ORIGINAL = 'none';
const SLIDER_OPTIONS = {
  [EFFECT_ORIGINAL]: {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    connect: 'lower',
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: (value) => value,
    },
  },
  'chrome': {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
  },
  'sepia': {
    range: {
      min: 0,
      max: 1,
    },
    start: 1,
    step: 0.1,
    format: {
      to: function (value) {
        if (Number.isInteger(value)) {
          return value.toFixed(0);
        }
        return value.toFixed(1);
      },
      from: (value) => value,
    },
  },
  'marvin': {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
  },
  'phobos': {
    range: {
      min: 0,
      max: 3,
    },
    start: 3,
    step: 0.1,
  },
  'heat': {
    range: {
      min: 1,
      max: 3,
    },
    start: 3,
    step: 0.1,
  },
};

const EFFECT_STYLE = {
  [EFFECT_ORIGINAL]: 'none',
  'chrome': 'grayscale',
  'sepia': 'sepia',
  'marvin': 'invert',
  'phobos': 'blur',
  'heat': 'brightness',
};

const EFFECT_MEASURE = {
  [EFFECT_ORIGINAL]: '',
  'chrome': '',
  'sepia': '',
  'marvin': '%',
  'phobos': 'px',
  'heat': '',
};

noUiSlider.create(sliderElement, SLIDER_OPTIONS[EFFECT_ORIGINAL]);
sliderElement.setAttribute('disabled', true);
let currentEffect = EFFECT_ORIGINAL;

const updatePreviewStyle = () => {
  if (currentEffect === EFFECT_ORIGINAL) {
    imgUploadPreviewElement.style.filter = 'none';
  } else {
    imgUploadPreviewElement.style.filter = `${EFFECT_STYLE[currentEffect]}(${effectLevelValue.value}${EFFECT_MEASURE[currentEffect]})`;
  }
};

sliderElement.noUiSlider.on('update', () => {
  effectLevelValue.value = sliderElement.noUiSlider.get();
  updatePreviewStyle();
});

const getCurrentEffect = () => {
  let effect;
  effectsRadioList.forEach((item) => {
    if (item.checked === true) {
      effect = item.value;
    }
  });
  return effect;
};

const resetAllEffects = () => {
  imgUploadPreviewElement.classList.forEach((item) => {
    if (item.startsWith('effects__preview--')) {
      imgUploadPreviewElement.classList.remove(item);
    }
  });
  imgUploadPreviewElement.style.filter = 'none';
};

const setupEffect = (effect) => {
  if (effect === EFFECT_ORIGINAL) {
    sliderElement.setAttribute('disabled', true);
  } else {
    sliderElement.removeAttribute('disabled');
    imgUploadPreviewElement.classList.add(`effects__preview--${effect}`);
  }
  sliderElement.noUiSlider.updateOptions(SLIDER_OPTIONS[effect]);
  updatePreviewStyle();
};

const applyEffect = () => {
  resetAllEffects();
  setupEffect(currentEffect);
};

effectsListElement.addEventListener('click', (evt) => {
  if (evt.target.nodeName === 'INPUT') {
    currentEffect = getCurrentEffect();
    applyEffect();
  }
});

uploadFile.addEventListener('change', () => {
  showForm();
  applyScaleValue();
  currentEffect = EFFECT_ORIGINAL;
  applyEffect();
});
