//Функция, возвращающая случайное целое число из переданного диапазона включительно.

const randomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

randomNumber();


/*Функция для проверки максимальной длины строки. Будет использоваться для проверки длины введённого комментария, но должна быть универсальна.
Пример использования функции: имя_функции(проверяемая_строка, максимальная_длина);
ТЗ 2.4. Комментарий:
комментарий не обязателен;
длина комментария не может составлять больше 140 символов;
если фокус находится в поле ввода комментария, нажатие на Esc не должно приводить к закрытию формы редактирования изображения.*/


const commentFootertext = document.querySelector('.social__footer-text');
const commentButton = document.querySelector('.social__footer-btn');

commentFootertext.oniput = function () {
  commentFootertext.textContent = commentFootertext.value.length;

  if (commentFootertext > 140) {
    commentButton.classList.add('disabled');
  }
};
