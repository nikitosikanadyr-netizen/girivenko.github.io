let secretNumber;
let attempts;
let playerName;
let maxNumber;
let timer;
let time = 0;

function startGame() {
  playerName = document.getElementById("playerName").value.trim();
  maxNumber = Number(document.getElementById("difficulty").value);

  if (!playerName) {
    alert("Введите имя!");
    return;
  }

  document.getElementById("gameArea").classList.remove("hidden");
  newGame();
}

function newGame() {
  secretNumber = Math.floor(Math.random() * maxNumber) + 1;
  attempts = 0;
  time = 0;

  clearInterval(timer);
  timer = setInterval(() => {
    time++;
    document.getElementById("timer").textContent = time;
  }, 1000);

  document.getElementById("message").textContent = `Число от 1 до ${maxNumber}`;
  document.getElementById("guessInput").value = "";
}

function checkGuess() {
  const guess = Number(document.getElementById("guessInput").value);

  if (!guess || guess < 1 || guess > maxNumber) {
    alert("Некорректный ввод!");
    return;
  }

  attempts++;

  if (guess === secretNumber) {
    clearInterval(timer);

    document.getElementById("message").textContent =
      `🎉 Угадано за ${attempts} попыток и ${time} сек!`;

    // document.getElementById("winSound").play();

    saveResult();
    updateLeaderboard();

  } else if (guess < secretNumber) {
    document.getElementById("message").textContent = "⬆️ Больше";
  } else {
    document.getElementById("message").textContent = "⬇️ Меньше";
  }

  document.getElementById("guessInput").value = "";
}

function saveResult() {
  let records = JSON.parse(localStorage.getItem("records")) || [];

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

function updateLeaderboard() {
  const list = document.getElementById("leaderboard");
  list.innerHTML = "";

  let records =
 JSON.parse(localStorage.getItem("records")) || [];

  records.forEach((r, i) => {
    const li = document.createElement("li");
    li.textContent = `${i + 1}. ${r.name} — ${r.attempts} попыток, ${r.time} сек`;
    list.appendChild(li);
  });
}

window.onload = updateLeaderboard; 