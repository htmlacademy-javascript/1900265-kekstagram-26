/* функции для создания массива из 25 сгенерированных объектов.
Каждый объект массива — описание фотографии, опубликованной пользователем.

Структура каждого объекта должна быть следующей:

- id, число — идентификатор описания. Это число от 1 до 25. Идентификаторы не должны повторяться.

- url, строка — адрес картинки вида photos/{{i}}.jpg, где {{i}} — это число от 1 до 25. Адреса картинок не должны повторяться.

- description, строка — описание фотографии. Описание придумайте самостоятельно.

- likes, число — количество лайков, поставленных фотографии. Случайное число от 15 до 200.

- comments, массив объектов — список комментариев, оставленных другими пользователями к этой фотографии.

*/
import {getDescriptions} from './get-descriptions.js';
import {getLikes} from './get-likes.js';
import {getComments} from './get-comments.js';

const CARD_QUANTITY = 25;

function getCards() {
  return Array.from({length: CARD_QUANTITY}, getRandomCard);
}

function getRandomCard(_, index) {
  return {
    id: index + 1,
    url: `photos/${index + 1}.jpg`,
    description: getDescriptions(),
    likes: getLikes(),
    comments: getComments(),
  };
}

getCards();
