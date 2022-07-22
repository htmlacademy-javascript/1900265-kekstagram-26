/* функции для создания массива из 25 сгенерированных объектов.
Каждый объект массива — описание фотографии, опубликованной пользователем.
Структура каждого объекта должна быть следующей:
- id, число — идентификатор описания. Это число от 1 до 25. Идентификаторы не должны повторяться.
- url, строка — адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.
- description, строка — описание фотографии. Описание придумайте самостоятельно.
- likes, число — количество лайков, поставленных фотографии. Случайное число от 15 до 200.
- comments, массив объектов — список комментариев, оставленных другими пользователями к этой фотографии.
Количество комментариев к каждой фотографии вы определяете на своё усмотрение.
Все комментарии генерируются случайным образом. Пример описания объекта с комментарием:
  {
    id: 135,
    avatar: 'img/avatar-6.svg',
    message: 'В целом всё неплохо. Но не всё.',
    name: 'Артём',
  }
  - У каждого комментария есть идентификатор — id — случайное число. Идентификаторы не должны повторяться.
  - Поле avatar — это строка, значение которой формируется по правилу img/avatar-{{случайное число от 1 до 6}}.svg.
  - Аватарки подготовлены в директории img.
  - Для формирования текста комментария — message — вам необходимо взять одно или два случайных предложения из представленных ниже:
  - Имена авторов также должны быть случайными. Набор имён для комментаторов составьте сами. Подставляйте случайное имя в поле name.
*/
import {getRandomPositiveInteger, getRandomElement} from './utils.js';

const descriptions = [
  'Интересный ракурск',
  'Хорошая цветопередача',
  'Классный кадр',
  'Всё чётко',
  'Нестандартный подход',
  'Профессиональная выдержка',
];

const messages = [
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!',
];

const names = [
  'Артём',
  'Оля',
  'Вася',
  'Петя',
  'Катя',
  'Коля',
  'Света',
];

const CARD_QUANTITY = 25;

function getCards() {
  return Array.from({length: CARD_QUANTITY}, getRandomCard);
}

const MIN_LIKE_QUANTITY = 15;
const MAX_LIKE_QUANTITY = 200;

function getRandomCard(_, index) {
  return {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: getRandomElement(descriptions),
    likes: getRandomPositiveInteger(MIN_LIKE_QUANTITY, MAX_LIKE_QUANTITY),
    comments: getComments(),
  };
}

const MIN_COMMENT_QUANTITY = 1;
const MAX_COMMENT_QUANTITY = 2;

function getComments() {
  return Array.from({length: getRandomPositiveInteger(MIN_COMMENT_QUANTITY, MAX_COMMENT_QUANTITY)}, getRandomComment);
}

const MIN_AVATAR_ID = 1;
const MAX_AVATAR_ID = 6;

function getRandomComment() {
  return {
    id: getCommentId(), // Можно использовать getRandomArrayId from util.js
    avatar: `img/avatar-${getRandomPositiveInteger(MIN_AVATAR_ID, MAX_AVATAR_ID)}.svg`,
    message: getRandomElement(messages),
    name: getRandomElement(names),
  };
}

//Последовательная генерация Id:
let lastCommentId = 0;

function getCommentId() {
  lastCommentId += 1;
  return lastCommentId;
}

getCards();

export {getCards};