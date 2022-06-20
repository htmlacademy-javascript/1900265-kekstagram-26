/*
2. На основе временных данных для разработки и шаблона #picture создайте DOM-элементы,
соответствующие фотографиям, и заполните их данными:
- Адрес изображения url подставьте как атрибут src изображения.
- Количество лайков likes выведите в блок .picture__likes.
- Количество комментариев comments выведите в блок .picture__comments.

3. Отрисуйте сгенерированные DOM-элементы в блок .pictures.
Для вставки элементов используйте DocumentFragment.
*/

/*
Шаблон изображения случайного пользователя:
  <template id="picture">
    <a href="#" class="picture">
      <img class="picture__img" src="" width="182" height="182" alt="Случайная фотография">
      <p class="picture__info">
        <span class="picture__comments"></span>
        <span class="picture__likes"></span>
      </p>
    </a>
  </template>
*/
import {getCards} from './data.js';

const listPictures = document.querySelector('.pictures');
const templatePicture = document.querySelector('#picture').content.querySelector('.picture');

const getPictures = getCards();

const listPicturesFragment = document.createDocumentFragment();

getPictures.forEach(({likes, url, comments}) => {
  const elementPicture = templatePicture.cloneNode(true);
  elementPicture.querySelector('.picture__likes').textContent = likes;
  elementPicture.querySelector('.picture__img').src = url;
  elementPicture.querySelector('.picture__comments').textContent = comments.length;
  listPicturesFragment.appendChild(elementPicture);
});

listPictures.appendChild(listPicturesFragment);
