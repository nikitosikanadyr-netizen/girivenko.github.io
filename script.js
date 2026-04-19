let secretNumber;
let attempts;
let playerName;
let maxNumber;
let timer;
let time = 0;

//  Запуск игры
function startGame() {
  const nameInput = document.getElementById("playerName");
  playerName = nameInput.value.trim();
  maxNumber = Number(document.getElementById("difficulty").value);

  // nameInput.classList.remove("error-input");

  if (playerName === "") {
    showMessage("! Введите имя игрока", "error");
    nameInput.classList.add("error-input");
    nameInput.focus();
    return;
  }

  document.getElementById("gameArea").classList.remove("hidden");
  newGame();
}

//  Новая игра
function newGame() {
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  time = 0;

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  showMessage(`Число от 1 до ${maxNumber}`, "hint");
  document.getElementById("guessInput").value = "";
}

//  Проверка числа
function checkGuess() {
  const input = document.getElementById("guessInput");
  const value = input.value.trim();

  if (value === "") {
    showMessage("! Введите число", "error");
    return;
  }

  if (isNaN(value)) {
    showMessage("! Это не число", "error");
    return;
  }

  const guess = Number(value);

  if (guess < 1 || guess > maxNumber) {
    showMessage(`! Число от 1 до ${maxNumber}`, "error");
    return;
  }

  attempts++;

  if (guess === secretNumber) {
    clearInterval(timer);
    showMessage(` Угадано за ${attempts} попыток и ${time} сек`, "success");
    saveResult();
    updateLeaderboard();
  } else if (guess < secretNumber) {
    showMessage("⬆️ Больше", "hint");
  } else {
    showMessage("⬇️ Меньше", "hint");
  }

  input.value = "";
}

//  Сообщения
function showMessage(text, type = "") {
  const msg = document.getElementById("message");
  msg.textContent = text;
  msg.className = type;
}

//  Сохранение результата
function saveResult() {
  let records =
  JSON.parse(localStorage.getItem("records")) || [];

  records.push({
    name: playerName,
    attempts,
    time
  });

  records.sort((a, b) =>
    a.attempts === b.attempts
      ? a.time - b.time
      : a.attempts - b.attempts
  );

  records = records.slice(0, 10);

  localStorage.setItem("records", JSON.stringify(records));
}

//  Обновление таблицы
function updateLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  let records = JSON.parse(localStorage.getItem("records")) || [];

  records.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r.name} — ${r.attempts} попыток, ${r.time} сек`;
    list.appendChild(li);
  });
}

//  События (Enter + очистка ошибки)
window.onload = function () {
  updateLeaderboard();

  // Enter для числа
  document.getElementById("guessInput").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      checkGuess();
    }
  });

  // Enter для имени
  document.getElementById("playerName").addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      startGame();
    }
  });

  // Убрать красную подсветку при вводе имени
  document.getElementById("playerName").addEventListener("input", function() {
    this.classList.remove("error-input");
  });
};