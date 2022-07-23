const sliderElement = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');
const effectsRadioList = document.querySelectorAll('.effects__radio');
const effectsListElement = document.querySelector('.effects__list');
const imgUploadPreviewElement = document.querySelector('.img-upload__preview img');

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
    sliderElement.classList.add('hidden');
  } else {
    sliderElement.removeAttribute('disabled');
    sliderElement.classList.remove('hidden');
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

const applyOriginalEffect = () => {
  currentEffect = EFFECT_ORIGINAL;
  applyEffect();
};

export {applyOriginalEffect};
