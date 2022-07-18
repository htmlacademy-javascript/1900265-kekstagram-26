/* функция генерации случайного целого числа*/
function getRandomPositiveInteger (a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random()*(upper - lower + 1) + lower;
  return Math.floor(result);
}

/* функция генерации случайного элемента из массива */
function getRandomElement(elements) {
  return elements[getRandomPositiveInteger(0, elements.length - 1)];
}

/* Рандомная генерация Id */

const arrayIds = [];
const MIN_ITEM_ID = 1;
const MAX_ITEM_ID = 1000000000;

function getRandomArrayId() {
  const randomItemId = getRandomPositiveInteger(MIN_ITEM_ID, MAX_ITEM_ID);
  if (arrayIds.includes(randomItemId)) {
    return getRandomArrayId();
  } else {
    arrayIds.push(randomItemId);
    return randomItemId;
  }
}

const isEscapeKey = function(evt) {
  return evt.key === 'Escape';
};

const ALERT_SHOW_TIME = 5000;

const showAlert = (message) => {
  const alertContainer = document.createElement('div');
  alertContainer.style.zIndex = '100';
  alertContainer.style.position = 'absolute';
  alertContainer.style.top = '0';
  alertContainer.style.left = '0';
  alertContainer.style.right = '0';
  alertContainer.style.padding = '10px';
  alertContainer.style.fontSize = '18px';
  alertContainer.style.color = '#fffff';
  alertContainer.style.textAlign = 'center';
  alertContainer.style.backgroundColor = '#ff4e4e';

  alertContainer.textContent = message;

  document.body.append(alertContainer);

  setTimeout(() => {
    alertContainer.remove();
  }, ALERT_SHOW_TIME);
};

// основано на алгоритме Fisher–Yates shuffle

const getRandomElements = (array, count) => {
  let i = array.length;
  while (--i > 0) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[randomIndex], array[i]] = [array[i], array[randomIndex]];
    if (i <= array.length - count) {
      break;
    }
  }
  return array.slice(-count);
};


export {getRandomPositiveInteger, getRandomElement, getRandomArrayId, isEscapeKey, showAlert, getRandomElements};
