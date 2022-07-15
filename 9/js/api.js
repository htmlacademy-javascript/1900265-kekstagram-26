import {showAlert} from './utils.js';

const EMPTY_RESPONSE = new Response('[]');

const getData = (cb) => {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .catch(() => {
      showAlert('Ошибка соединения с сервером. Попробуйте ещё раз.');
      return EMPTY_RESPONSE;
    })
    .then((response) => {
      if (response.ok) {
        return response;
      } else {
        showAlert('Сервер не предоставил данные. Попробуйте ещё раз.');
        return EMPTY_RESPONSE;
      }
    })
    .then((response) => response.json())
    .then((data) => cb(data));
};

const sendData = (body, onSuccess, onError) => {

  fetch(
    'https://26.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onError();
      }
    });
};

export {getData, sendData};
