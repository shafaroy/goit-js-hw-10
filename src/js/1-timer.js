import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import '../css/1-timer.css';

const input = document.querySelector('#datetime-picker');
const startBtn = document.querySelector('[data-start]');

const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

startBtn.disabled = true;

let userSelectedDate;
let timerId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0].getTime() <= Date.now()) {
      startBtn.disabled = true;

      iziToast.error({
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      return;
    }

    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(input, options);

startBtn.addEventListener('click', () => {
  startBtn.disabled = true;
  input.disabled = true;

  // Okamžitě zobraz čas
  const deltaTime = userSelectedDate - Date.now();
  updateTimer(convertMs(deltaTime));

  timerId = setInterval(() => {
    const deltaTime = userSelectedDate - Date.now();

    if (deltaTime <= 0) {
      clearInterval(timerId);
      timerId = null;

      updateTimer({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      });

      input.disabled = false;
      startBtn.disabled = true;
      return;
    }

    updateTimer(convertMs(deltaTime));
  }, 1000);
});

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimer({ days, hours, minutes, seconds }) {
  daysEl.textContent = addLeadingZero(days);
  hoursEl.textContent = addLeadingZero(hours);
  minutesEl.textContent = addLeadingZero(minutes);
  secondsEl.textContent = addLeadingZero(seconds);
}
