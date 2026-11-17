const slider = document.querySelector('#minutes');
const minuteOutput = document.querySelector('#minute-output');
const days = document.querySelector('#days');
const hours = document.querySelector('#hours');
function updateTime() {
  const minutes = Number(slider.value);
  minuteOutput.textContent = `${minutes} minutes`;
  slider.setAttribute('aria-valuetext', `${minutes} minutes per day`);
  const annualHours = minutes * 365 / 60;
  days.textContent = String(Math.floor(annualHours / 24));
  hours.textContent = annualHours.toLocaleString('en-US', { maximumFractionDigits: 1 });
}
slider.addEventListener('input', updateTime);
updateTime();
document.querySelector('#year').textContent = new Date().getFullYear();
