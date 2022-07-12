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
const imgUploadPreviewElement = document.querySelector('.img-upload__preview').querySelector('img');

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
  scaleControlSmallerElement.removeEventListener('click', decreaseScale);
  scaleControlBiggerElement.removeEventListener('click', increaseScale);
  textHashtagsElement.value = '';
  textDescriptionElement.value = '';
  scaleValue = SCALE_DEFAULT;
  applyScaleValue();
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
  applyScaleValue();
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

//слайдер

/*
2.2. Наложение эффекта на изображение:
1/ По умолчанию должен быть выбран эффект «Оригинал».

2/  На изображение может накладываться только один эффект.

3/  При смене эффекта, выбором одного из значений среди радиокнопок .effects__radio,
добавить картинке внутри .img-upload__preview CSS-класс, соответствующий эффекту.
Например, если выбран эффект .effect-chrome, изображению нужно добавить
класс effects__preview--chrome.

4/  Интенсивность эффекта регулируется перемещением ползунка в слайдере.
Слайдер реализуется сторонней библиотекой для реализации слайдеров noUiSlider.
Уровень эффекта записывается в поле .effect-level__value.
ри изменении уровня интенсивности эффекта (предоставляется API слайдера),
CSS-стили картинки внутри .img-upload__preview обновляются следующим образом:
  - Для эффекта «Хром» — filter: grayscale(0..1) с шагом 0.1;
  - Для эффекта «Сепия» — filter: sepia(0..1) с шагом 0.1;
  - Для эффекта «Марвин» — filter: invert(0..100%) с шагом 1%;
  - Для эффекта «Фобос» — filter: blur(0..3px) с шагом 0.1px;
  - Для эффекта «Зной» — filter: brightness(1..3) с шагом 0.1;
  - Для эффекта «Оригинал» CSS-стили filter удаляются.

5/ При выборе эффекта «Оригинал» слайдер скрывается.

6/ При переключении эффектов, уровень насыщенности сбрасывается до начального значения (100%):
слайдер, CSS-стиль изображения и значение поля должны обновляться.

7/  Кроме визуального применения эффекта необходимо записывать значение
в скрытое поле для дальнейшей отправки на сервер.

8/ при переключении фильтра, уровень эффекта должен сразу сбрасываться до начального состояния,
т. е. логика по определению уровня насыщенности должна срабатывать не только при «перемещении» слайдера,
но и при переключении фильтров.
*/

const sliderElement = document.querySelector('.effect-level__slider');
const effectsRadioList = document.querySelectorAll('.effects__radio');
const effectsListElement = document.querySelector('.effects__list');

noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 1,
  },
  start: 1,
  step: 0.1,
  connect: 'lower',
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
};

const EFFECT_ORIGINAL = 'none';

const setupEffect = (effect) => {
  if (effect !== EFFECT_ORIGINAL) {
    imgUploadPreviewElement.classList.add(`effects__preview--${effect}`);
  }
};

const applyEffect = () => {
  const currentEffect = getCurrentEffect();
  resetAllEffects();
  setupEffect(currentEffect);
};

effectsListElement.addEventListener('click', (evt) => {
  if (evt.target.nodeName === 'INPUT') {
    applyEffect();
  }
});


