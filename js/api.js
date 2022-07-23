const getData = (cb, onError) => {
  fetch('https://26.javascript.pages.academy/kekstagram/data')
    .then((response) => {
      if (response.ok) {
        return response;
      }
    })
    .then((response) => response.json())
    .then((data) => cb(data))
    .catch(() => {
      onError();
    });
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
    })
    .catch(() => {
      onError();
    });
};

export {getData, sendData};
