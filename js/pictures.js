/*
2. На основе временных данных для разработки и шаблона #picture создайте DOM-элементы,
соответствующие фотографиям, и заполните их данными:
- Адрес изображения url подставьте как атрибут src изображения.
- Количество лайков likes выведите в блок .picture__likes.
- Количество комментариев comments выведите в блок .picture__comments.

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

3. Отрисуйте сгенерированные DOM-элементы в блок .pictures.
Для вставки элементов используйте DocumentFragment.

- связь модули миниатюр и полноразмерного режима:
импорт модуля полноразмерных изображений в модуль миниатюр и дальнейшая работа с интерфейсом этого модуля, addEventListener и замыканиями.
*/

import {getCards} from './data.js';
import {renderBigPicture} from './big-pictures.js';

const listPictures = document.querySelector('.pictures');
const templatePicture = document.querySelector('#picture').content.querySelector('.picture');

function renderPictures(pictures) {
  const listPicturesFragment = document.createDocumentFragment();
  pictures.forEach(({likes, url, comments, description}) => {
    const elementPicture = templatePicture.cloneNode(true);
    elementPicture.querySelector('.picture__likes').textContent = likes;
    elementPicture.querySelector('.picture__img').src = url;
    elementPicture.querySelector('.picture__comments').textContent = comments.length;
    elementPicture.addEventListener('click', () => renderBigPicture(url, likes, comments, description));
    listPicturesFragment.appendChild(elementPicture);
  });
  listPictures.appendChild(listPicturesFragment);
}

renderPictures(getCards());
