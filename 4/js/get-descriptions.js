/* Рандомная генерация описания фото*/
import {getRandomElement} from './util.js';


const descriptions = [
  'Интересный ракурск',
  'Хорошая цветопередача',
  'Классный кадр',
  'Всё чётко',
  'Нестандартный подход',
  'Профессиональная выдержка',
];

function getDescriptions() {
  return getRandomElement(descriptions);
}

export {getDescriptions};
