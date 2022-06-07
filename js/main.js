//Функция, возвращающая случайное целое число из переданного диапазона включительно.

const randomNumber = function (min, max) {
  if (min > max) {
    return undefined;
  }

  return Math.round(Math.random() * (max - min) + min);
};

randomNumber();


/*Функция для проверки максимальной длины строки. Будет использоваться для проверки длины введённого комментария, но должна быть универсальна.
Пример использования функции: имя_функции(проверяемая_строка, максимальная_длина);
*/

const checkLength = function (text, maxLength) {
  return text.length <= maxLength;
};

checkLength();
