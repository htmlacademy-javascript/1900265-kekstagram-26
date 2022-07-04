/* Форма редактирования изображения
Выбор изображения для загрузки осуществляется с помощью стандартного контрола загрузки файла #upload-file, который стилизован под букву «О» в логотипе.

1. Показать форму:
  - После выбора изображения (изменения значения поля #upload-file), показывается форма редактирования изображения.
  - У элемента .img-upload__overlay удаляется класс hidden.
  - У элемента body задаётся класс modal-open.

2. Закрыть форму:
  - производится либо нажатием на кнопку #upload-cancel, либо нажатием клавиши Esc.
  - Элементу .img-upload__overlay возвращается класс hidden.
  - У элемента body удаляется класс modal-open.

3. Валидация хештегов
Набор хэш-тегов можно превратить в массив, воспользовавшись методом .split().
Написать цикл, который будет ходить по полученному массиву и проверять каждый из хэш-тегов на предмет соответствия ограничениям.
Если хотя бы один из тегов не проходит нужных проверок, показывать сообщение об ошибке.
ТЗ 2.3. Хэш-теги:
- хэш-тег начинается с символа # (решётка);
- строка после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.;
- хеш-тег не может состоять только из одной решётки;
- максимальная длина одного хэш-тега 20 символов, включая решётку;
- хэш-теги нечувствительны к регистру: #ХэшТег и #хэштег считаются одним и тем же тегом;
- хэш-теги разделяются пробелами;
- один и тот же хэш-тег не может быть использован дважды;
- нельзя указать больше пяти хэш-тегов;
- хэш-теги необязательны;
- если фокус находится в поле ввода хэш-тега, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.

4. Валидация комментариев:
ТЗ  2.4. Комментарий:
- комментарий не обязателен;
- длина комментария не может составлять больше 140 символов;
- если фокус находится в поле ввода комментария, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.
*/
import {isEscapeKey} from './utils.js';

const uploadForm = document.querySelector('.img-upload__form');
const uploadFile = uploadForm.querySelector('#upload-file');
const bodyElement = document.querySelector('body');
const uploadCancel = uploadForm.querySelector('#upload-cancel');

uploadFile.addEventListener('change', () => {
  document.addEventListener('keydown', keydownEscapeHandler);
  uploadCancel.addEventListener('click', clickHandler);
  uploadForm.querySelector('.img-upload__overlay').classList.remove('hidden');
  bodyElement.classList.add('modal-open');
});

const textHashtagsElement = uploadForm.querySelector('.text__hashtags');
const textDescriptionElement = uploadForm.querySelector('.text__description');

function keydownEscapeHandler(evt) {
  if (isEscapeKey(evt)) {
    if (document.activeElement !== textHashtagsElement && document.activeElement !== textDescriptionElement) {
      evt.preventDefault();
      uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
      bodyElement.classList.remove('modal-open');
      document.removeEventListener('keydown', keydownEscapeHandler);
    }
  }
}

function clickHandler() {
  uploadForm.querySelector('.img-upload__overlay').classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  uploadCancel.removeEventListener('click', clickHandler);
}

const pristine = new Pristine(uploadForm);
const templateSuccess = document.querySelector('#success').content.querySelector('.success');
const templateError = document.querySelector('#error').content.querySelector('.error');
const uploadTextElement = document.querySelector('.img-upload__text');

const re = /^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/;

function hashtagValidator (value) {
  const words = value.trim().split(' ');
  let isValid = words.every((word) => re.test(word));
  if (isValid) {
    isValid = new Set(words).size === words.length;
  }
  if (isValid) {
    isValid = words.length <= 5;
  }
  return isValid;
}

pristine.addValidator(textHashtagsElement, hashtagValidator);

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristine.validate();
  if (isValid) {
    const elementSuccess = templateSuccess.cloneNode(true);
    elementSuccess.querySelector('.success__button').addEventListener('click', () => elementSuccess.remove());
    uploadTextElement.appendChild(elementSuccess);
  } else {
    const elementError = templateError.cloneNode(true);
    elementError.querySelector('.error__button').addEventListener('click', () => elementError.remove());
    uploadTextElement.appendChild(elementError);
  }
});
