const factorAEl = document.getElementById("factorA");
const factorBEl = document.getElementById("factorB");
const answerForm = document.getElementById("answerForm");
const answerInput = document.getElementById("answerInput");
const messageEl = document.getElementById("message");
const scoreEl = document.getElementById("score");
const streakEl = document.getElementById("streak");
const gridEl = document.getElementById("grid");
const nextBtn = document.getElementById("nextBtn");

const legendRowsEl = document.getElementById("legendRows");
const legendColsEl = document.getElementById("legendCols");

const GAME = {
  a: 2,
  b: 3,
  score: 0,
  streak: 0,
};

let nextRoundTimeoutId = null;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateHUD() {
  scoreEl.textContent = GAME.score;
  streakEl.textContent = GAME.streak;
}

function updateTask() {
  factorAEl.textContent = GAME.a;
  factorBEl.textContent = GAME.b;
}

function updateLegend(total) {
  legendRowsEl.textContent = `Редове: ${GAME.a}`;
  legendColsEl.textContent = `Колони: ${GAME.b}`;
}

function drawDots() {
  const total = GAME.a * GAME.b;
  gridEl.innerHTML = "";
  gridEl.style.setProperty("--rows", String(GAME.a));
  gridEl.style.setProperty("--cols", String(GAME.b));

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.animationDelay = `${i * 18}ms`;
    gridEl.appendChild(dot);
  }

  updateLegend(total);
}

function clearRoundFeedback() {
  answerForm.reset();
  messageEl.textContent = "";
  messageEl.className = "message";
}

function newRound() {
  if (nextRoundTimeoutId) {
    clearTimeout(nextRoundTimeoutId);
    nextRoundTimeoutId = null;
  }

  GAME.a = randomInt(1, 10);
  GAME.b = randomInt(1, 10);
  clearRoundFeedback();
  updateTask();
  drawDots();
  answerInput.focus();
}

function setMessage(text, ok) {
  messageEl.textContent = text;
  messageEl.className = ok ? "message good" : "message bad";
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = Number(answerInput.value);
  const expected = GAME.a * GAME.b;

  if (!Number.isFinite(value) || answerInput.value.trim() === "") {
    setMessage("Въведи число, за да проверим.", false);
    return;
  }

  if (value === expected) {
    GAME.score += 10;
    GAME.streak += 1;
    updateHUD();
    setMessage(`Браво! ${GAME.a} × ${GAME.b} = ${expected}`, true);
    nextRoundTimeoutId = setTimeout(() => {
      nextRoundTimeoutId = null;
      newRound();
    }, 700);
    return;
  }

  GAME.streak = 0;
  GAME.score = Math.max(0, GAME.score - 3);
  updateHUD();
  setMessage(`Почти! Правилният отговор е ${expected}.`, false);
});

nextBtn.addEventListener("click", () => {
  GAME.streak = 0;
  updateHUD();
  newRound();
});

updateHUD();
newRound();
