/* функции для создания массива из 25 сгенерированных объектов.
Каждый объект массива — описание фотографии, опубликованной пользователем.

Структура каждого объекта должна быть следующей:

id, число — идентификатор описания. Это число от 1 до 25. Идентификаторы не должны повторяться.

url, строка — адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.

description, строка — описание фотографии. Описание придумайте самостоятельно.

likes, число — количество лайков, поставленных фотографии. Случайное число от 15 до 200.

comments, массив объектов — список комментариев, оставленных другими пользователями к этой фотографии.
Количество комментариев к каждой фотографии вы определяете на своё усмотрение.
Все комментарии генерируются случайным образом. Пример описания объекта с комментарием:
{
  id: 135,
  avatar: 'img/avatar-6.svg',
  message: 'В целом всё неплохо. Но не всё.',
  name: 'Артём',
}
У каждого комментария есть идентификатор — id — случайное число. Идентификаторы не должны повторяться.

Поле avatar — это строка, значение которой формируется по правилу img/avatar-{{случайное число от 1 до 6}}.svg.
Аватарки подготовлены в директории img.

Для формирования текста комментария — message — вам необходимо взять одно или два случайных предложения из представленных ниже:
Всё отлично!
В целом всё неплохо. Но не всё.
Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.
Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.
Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.
Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!
Имена авторов также должны быть случайными. Набор имён для комментаторов составьте сами. Подставляйте случайное имя в поле name.
*/
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

function getCards() {
  return Array.from({length: 25}, getRandomCard);
}

function getRandomCard(_, index) {
  return {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: getRandomElement(descriptions),
    likes: getRandomPositiveInteger(15, 200),
    comments: getComments(),
  };
}

function getRandomElement(elements) {
  return elements[getRandomPositiveInteger(0, elements.length - 1)];
}

function getRandomPositiveInteger (a, b) {
  const lower = Math.ceil(Math.min(Math.abs(a), Math.abs(b)));
  const upper = Math.floor(Math.max(Math.abs(a), Math.abs(b)));
  const result = Math.random()*(upper - lower + 1) + lower;
  return Math.floor(result);
}

function getComments() {
  return Array.from({length: getRandomPositiveInteger(1, 2)}, getRandomComment);
}

function getRandomComment() {
  return {
    id: getCommentId(), // Можно использовать getRandomCommentId()
    avatar: `img/avatar-${getRandomPositiveInteger(1, 6)}.svg`,
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

//Рандомная генерация Id:
const commentIds = [];

function getRandomCommentId() {
  const randomCommentId = getRandomPositiveInteger(1, 1000000000);
  if (commentIds.includes(randomCommentId)) {
    return getRandomCommentId();
  } else {
    commentIds.push(randomCommentId);
    return randomCommentId;
  }
}

getCards();
getRandomCommentId();
