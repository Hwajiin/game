const FOUR_LEAF_COUNT = 2;
const THREE_LEAF_COUNT = 3;
const CLOVER_SIZE = 50;
const GAME_DURATION_TIME = 5;

const gameBtn = document.querySelector(".game__button");
const gameScore = document.querySelector(".game__score");
const gameTimer = document.querySelector(".game__timer");

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();

const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpRefresh = document.querySelector(".pop-up__refresh");

const winSound = new Audio("sound/game_win2.wav");
const bgSound = new Audio("sound/bg.wav");
const alertSound = new Audio("sound/alert.wav");
const gameOverSound = new Audio("sound/game_over.wav");

let started = false;
let score = 0;
let timer = undefined;

// Event Handler
gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

field.addEventListener("click", onFieldClick);

// Main Function
function startGame() {
  started = true;
  initGame();
  showStopBtn();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  hideGameBtn();
  showPopUpWithText("REPLAY⁉️");
  stopGameTimer();
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win) {
  started = false;
  if (win) {
    playSound(winSound);
  } else {
    playSound(gameOverSound);
  }
  stopSound(bgSound);
  hideGameBtn();
  stopGameTimer();
  showPopUpWithText(win ? "행운의 클로버" : "YOU LOST");
}
function initGame() {
  field.innerHTML = "";
  gameScore.innerText = `0/${FOUR_LEAF_COUNT}`;
  score = 0;
  addItem("fourLeaf", FOUR_LEAF_COUNT, "img/fourleaf.png");
  addItem("threeLeaf", THREE_LEAF_COUNT, "img/clover.png");
}

// About clover
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CLOVER_SIZE;
  const y2 = fieldRect.height - CLOVER_SIZE;

  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("src", imgPath);
    item.setAttribute("class", className);

    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.top = `${y}px`;
    item.style.left = `${x}px`;
    field.appendChild(item);
  }
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// show and hide
function showStopBtn() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hideGameBtn() {
  gameBtn.style.visibility = "hidden";
}

// score and timer
function showTimerAndScore() {
  gameScore.style.visibility = "visible";
  gameTimer.style.visibility = "visible";
}

function startGameTimer() {
  let remaining_time = GAME_DURATION_TIME;
  updateTimerText(remaining_time);
  timer = setInterval(() => {
    if (remaining_time <= 0) {
      clearInterval(timer);
      finishGame(false);
      return;
    } else {
      updateTimerText(--remaining_time);
    }
  }, 1000);
}

function updateTimerText(time) {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  gameTimer.innerText = `${min < 10 ? `0${min}` : `${min}`}:${
    sec < 10 ? `0${sec}` : `${sec}`
  }`;
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateScore(score) {
  gameScore.innerText = `${score}/${FOUR_LEAF_COUNT}`;
}
// popup
function showPopUpWithText(text) {
  popUp.classList.remove("pop-up--hide");
  popUpText.innerText = text;
}

function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}

// Field
function onFieldClick(e) {
  if (!started) return;
  const target = e.target;
  if (target.matches(".fourLeaf")) {
    target.remove();
    ++score;
    updateScore(score);
    if (FOUR_LEAF_COUNT === score) {
      finishGame(true);
    }
  }
}

// About sound
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound) {
  sound.pause();
}
