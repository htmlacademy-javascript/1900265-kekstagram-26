/*
2. Для отображения окна нужно удалять класс hidden у элемента .big-picture и каждый раз заполнять его данными о конкретной фотографии:
  - Адрес изображения url подставьте как src изображения внутри блока .big-picture__img.
  - Количество лайков likes подставьте как текстовое содержание элемента .likes-count.
  - Количество комментариев comments подставьте как текстовое содержание элемента .comments-count.
  - Список комментариев под фотографией: комментарии должны вставляться в блок .social__comments.
    Разметка каждого комментария должна выглядеть так:
    <li class="social__comment">
        <img
            class="social__picture"
            src="{{аватар}}"
            alt="{{имя комментатора}}"
            width="35" height="35">
        <p class="social__text">{{текст комментария}}</p>
    </li>
  - Описание фотографии description вставьте строкой в блок .social__caption.

3. После открытия окна спрячьте блоки счётчика комментариев .social__comment-count и загрузки новых комментариев .comments-loader,
добавив им класс hidden, с ними мы разберёмся позже, в другом домашнем задании.

4. После открытия окна добавьте тегу <body> класс modal-open, чтобы контейнер с фотографиями позади не прокручивался при скролле.
При закрытии окна не забудьте удалить этот класс.

5. Напишите код для закрытия окна по нажатию клавиши Esc и клике по иконке закрытия.
*/

function renderSocialComment(socialComments) {
  const listSocialComments = document.querySelector('.social__comments');
  const templateSocialComment = document.querySelector('.social__comment');
  document.querySelectorAll('.social__comment').forEach((item) => item.remove());
  const listSocialCommentsFragment = document.createDocumentFragment();

  const MAX_RENDER_COMMENTS = 5;

  socialComments.slice(0, MAX_RENDER_COMMENTS).forEach(({avatar, name, message}) => {
    const elementSocialComment = templateSocialComment.cloneNode(true);
    elementSocialComment.querySelector('.social__picture').src = avatar;
    elementSocialComment.querySelector('.social__picture').alt = name;
    elementSocialComment.querySelector('.social__text').textContent = message;
    listSocialCommentsFragment.appendChild(elementSocialComment);
  });
  listSocialComments.appendChild(listSocialCommentsFragment);
}

function renderBigPicture(url, likes, comments, description) {
  const bigPicture = document.querySelector('.big-picture');
  bigPicture.classList.remove('hidden');
  bigPicture.querySelector('.big-picture__img').querySelector('img').src = url;
  bigPicture.querySelector('.likes-count').textContent = likes;
  bigPicture.querySelector('.comments-count').textContent = comments.length;
  bigPicture.querySelector('.social__caption').textContent = description;
  renderSocialComment(comments);

  bigPicture.querySelector('.social__comment-count').classList.add('hidden');
  bigPicture.querySelector('.comments-loader').classList.add('hidden');
  document.querySelector('body').classList.add('modal-open');

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      bigPicture.classList.add('hidden');
      document.querySelector('body').classList.remove('modal-open');
    }
  });

  bigPicture.querySelector('.big-picture__cancel').addEventListener('click', () => {
    bigPicture.classList.add('hidden');
    document.querySelector('body').classList.remove('modal-open');
  });
}

export {renderBigPicture};
