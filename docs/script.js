const circle       = document.getElementById('circle');
const difficulty   = document.getElementById('difficulty');
const newBtn       = document.getElementById('new-problem');
const answerInput  = document.getElementById('answer');
const submitBtn    = document.getElementById('submit');
const messageDiv   = document.getElementById('message');
const timerDisplay = document.getElementById('timer');
const startBtn     = document.getElementById('start-timer');
const stopBtn      = document.getElementById('stop-timer');

let numbers = [];
let correctSum = 0;
let startTime = 0;
let timerInterval;
let timerRunning = false;    //  track whether timer is running

function generateNumbers(count) {
  numbers = [];
  correctSum = 0;
  for (let i = 0; i < count; i++) {
    const num = Math.floor(Math.random() * 90) + 10;
    numbers.push(num);
    correctSum += num;
  }
}

function renderCircle() {
  circle.innerHTML = '';
  const count = numbers.length;
  const radius = 160;
  for (let i = 0; i < count; i++) {
    const num = numbers[i];
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const x = radius * Math.cos(angle) + 200 - 30;
    const y = radius * Math.sin(angle) + 200 - 30;
    const el = document.createElement('div');
    el.className = 'number';
    el.textContent = num;
    el.style.left = x + 'px';
    el.style.top  = y + 'px';
    circle.appendChild(el);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  startTime = performance.now();
  timerDisplay.textContent = 'Time: 0.00s';
  timerInterval = setInterval(() => {
    const t = (performance.now() - startTime) / 1000;
    timerDisplay.textContent = `Time: ${t.toFixed(2)}s`;
  }, 16);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function newProblem() {
const count = parseInt(difficulty.value, 10);
generateNumbers(count);
renderCircle();

messageDiv.textContent = '';
answerInput.value = '';
answerInput.classList.remove('wrong');
answerInput.focus();

// ← RESET timer, but don't start it
stopTimer();
timerRunning = false;
timerDisplay.textContent = 'Time: 0:00';
}
  

submitBtn.addEventListener('click', () => {
  const userSum = parseInt(answerInput.value, 10);
  if (isNaN(userSum)) return;
  if (userSum === correctSum) {
    stopTimer();
    const elapsed = ((performance.now() - startTime) / 1000).toFixed(2);
    messageDiv.textContent = `✅ Correct! Time: ${elapsed}s — Generating new…`;
    setTimeout(newProblem, 1500);
  } else {
    answerInput.classList.add('wrong');
    messageDiv.textContent = '❌ Incorrect, keep trying!';
    setTimeout(() => answerInput.classList.remove('wrong'), 400);
  }
});

newBtn.addEventListener('click', newProblem);
answerInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') submitBtn.click();
});

startBtn.addEventListener('click', () => {
    startTimer();
    timerRunning = true;
});

stopBtn.addEventListener('click', () => {
    stopTimer();
    timerRunning = false;
});

// Dark/light toggle
document.querySelector('.dark-toggle').addEventListener('click', () => {
  document.body.classList.toggle('light');
  if (document.body.classList.contains('light')) {
    document.body.style.background = '#f0f0f5';
    document.body.style.color      = '#1a1a1a';
  } else {
    document.body.style.background = '#0a0a0f';
    document.body.style.color      = '#e0e0e0';
  }
});

document.addEventListener('keydown', e => {
if (e.code === 'Space') {
    e.preventDefault();   // prevent scrolling
    if (!timerRunning) {
    startTimer();
    } else {
    stopTimer();
    }
    timerRunning = !timerRunning;
}
});

// kick off first problem
newProblem();
