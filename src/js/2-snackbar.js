// Описаний у документації
import iziToast from 'izitoast';
// Додатковий імпорт стилів
import 'izitoast/dist/css/iziToast.min.css';
const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  const delay = Number(form.delay.value);

  event.preventDefault();
  const promise = new Promise((resolve, reject) => {
    if (form.state.value === 'fulfilled') {
      setTimeout(() => {
        resolve(delay);
      }, delay);
    } else if (form.state.value === 'rejected') {
      setTimeout(() => {
        reject(delay);
      }, delay);
    }
  });
  promise
    .then(delay => {
      iziToast.show({
        title: 'Success',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topCenter',
        color: 'green',
      });
    })
    .catch(delay => {
      iziToast.show({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topCenter',
        color: 'red',
      });
    });
  event.currentTarget.reset();
});