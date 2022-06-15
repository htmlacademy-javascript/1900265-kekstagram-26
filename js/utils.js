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

export {getRandomPositiveInteger, getRandomElement, getRandomArrayId};
