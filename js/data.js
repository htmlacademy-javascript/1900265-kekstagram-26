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

let lastCommentId = 0;
const getCommentId = () => {
  lastCommentId += 1;
  return lastCommentId;
};

const MIN_AVATAR_ID = 1;
const MAX_AVATAR_ID = 6;
const getRandomComment = () => ({
  id: getCommentId(), // Можно использовать getRandomArrayId from util.js
  avatar: `img/avatar-${getRandomPositiveInteger(MIN_AVATAR_ID, MAX_AVATAR_ID)}.svg`,
  message: getRandomElement(messages),
  name: getRandomElement(names),
});

const MIN_COMMENT_QUANTITY = 1;
const MAX_COMMENT_QUANTITY = 5;
const getComments = () => Array.from({length: getRandomPositiveInteger(MIN_COMMENT_QUANTITY, MAX_COMMENT_QUANTITY)}, getRandomComment);

const MIN_LIKE_QUANTITY = 15;
const MAX_LIKE_QUANTITY = 200;
const getRandomCard = (_, index) => ({
  id: index + 1,
  url: `photos/${index + 1}.jpg`,
  description: getRandomElement(descriptions),
  likes: getRandomPositiveInteger(MIN_LIKE_QUANTITY, MAX_LIKE_QUANTITY),
  comments: getComments(),
});

const CARD_QUANTITY = 25;
const getCards = () => Array.from({length: CARD_QUANTITY}, getRandomCard);

export {getCards};
