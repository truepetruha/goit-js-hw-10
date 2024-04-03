import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const startBtn = document.querySelector('[data-start]');
const daysTime = document.querySelector('[data-days]');
const hoursTime = document.querySelector('[data-hours]');
const minutesTime = document.querySelector('[data-minutes]');
const secondsTime = document.querySelector('[data-seconds]');
const input = document.querySelector('#datetime-picker');

let userSelectedDate;
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();
    console.log(selectedDates[0]);
    auditUserSelected(userSelectedDate);
  },
};
flatpickr('#datetime-picker', options);

class Timer {
  constructor({ onTick }) {
    this.onTick = onTick;
    this.isActive = false;
    startBtn.disabled = true;
  }

  start() {
    const timerId = (this.intervalId = setInterval(() => {
      const currentTime = Date.now();
      const differenceTime = userSelectedDate - currentTime;
      const time = convertMs(differenceTime);
      this.onTick(time);
      startBtn.disabled = true;
      input.disabled = true;
      if (differenceTime < 1000) {
        clearInterval(timerId);
      }
    }, 1000));
  }
  stop() {}
}
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateClockface({ days, hours, minutes, seconds }) {
  daysTime.textContent = `${days}`.padStart(2, '0');
  hoursTime.textContent = `${hours}`.padStart(2, '0');
  minutesTime.textContent = `${minutes}`.padStart(2, '0');
  secondsTime.textContent = `${seconds}`.padStart(2, '0');
}

const timer = new Timer({
  onTick: updateClockface,
});
function auditUserSelected(userSelectedDate) {
  if (userSelectedDate < Date.now()) {
    startBtn.disabled = true;
    iziToast.show({
      title: 'Error',
      message: 'Please choose a date in the future!',
      position: 'topCenter',
      color: 'red',
    });
  } else {
    startBtn.disabled = false;
    iziToast.show({
      title: 'Success',
      message: 'Lets go',
      position: 'topCenter',
      color: 'green',
    });
  }
}

startBtn.addEventListener('click', timer.start.bind(timer));
