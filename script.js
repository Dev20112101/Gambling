// Slot items configured with property flags for fruit and yellow categorization
const slotItems = [
  { emoji: '🍒', isFruit: true, isYellow: false },
  { emoji: '🍋', isFruit: true, isYellow: true },
  { emoji: '🍉', isFruit: true, isYellow: false },
  { emoji: '🍌', isFruit: true, isYellow: true },
  { emoji: '⭐', isFruit: false, isYellow: true },
  { emoji: '💎', isFruit: false, isYellow: false }
];

let score = 100;
let isSpinning = false;

// DOM Elements
const scoreVal = document.getElementById("score-val");
const spinBtn = document.getElementById("spin-btn");
const messageDisplay = document.getElementById("message-display");
const reels = [
  document.getElementById("reel-1"),
  document.getElementById("reel-2"),
  document.getElementById("reel-3")
];

function init() {
  spinBtn.addEventListener("click", startSpin);
  updateScoreDisplay();
}

function updateScoreDisplay() {
  scoreVal.textContent = score;
  if (score < 10) {
    spinBtn.disabled = true;
    messageDisplay.textContent = "Game Over! Insufficient funds.";
    messageDisplay.style.color = "var(--danger)";
  }
}

function startSpin() {
  if (isSpinning || score < 10) return;

  isSpinning = true;
  score -= 10; // Spin cost (-10 points)
  updateScoreDisplay();
  spinBtn.disabled = true;
  messageDisplay.textContent = "Rolling...";
  messageDisplay.style.color = "var(--text-light)";

  reels.forEach(reel => reel.classList.add("spinning"));

  let completedReels = 0;
  const finalResults = [];

  reels.forEach((reel, index) => {
    const stopDelay = 1000 + index * 400;

    const intervalId = setInterval(() => {
      const randomItem = slotItems[Math.floor(Math.random() * slotItems.length)];
      reel.textContent = randomItem.emoji;
    }, 60);

    setTimeout(() => {
      clearInterval(intervalId);
      const finalItem = slotItems[Math.floor(Math.random() * slotItems.length)];
      reel.textContent = finalItem.emoji;
      reel.classList.remove("spinning");
      finalResults[index] = finalItem;

      completedReels++;
      if (completedReels === reels.length) {
        evaluateOutcome(finalResults);
      }
    }, stopDelay);
  });
}

function evaluateOutcome(results) {
  isSpinning = false;

  const [item1, item2, item3] = results;
  let pointsWon = 0;
  let winMessage = "";
  let messageColor = "var(--text-light)";

  // Condition checks
  const isAllSame = (item1.emoji === item2.emoji && item2.emoji === item3.emoji);
  const isAllYellow = (item1.isYellow && item2.isYellow && item3.isYellow);
  const isTwoSame = (item1.emoji === item2.emoji || item2.emoji === item3.emoji || item1.emoji === item3.emoji);
  const isAllFruits = (item1.isFruit && item2.isFruit && item3.isFruit);

  // Priority-based if-else chain (Highest value wins exclusively)
  if (isAllSame) {
    pointsWon = 100;
    winMessage = "JACKPOT! All Same (+100 pts)";
    messageColor = "var(--success)";
  } else if (isAllYellow) {
    pointsWon = 10;
    winMessage = "All Yellow! (+10 pts)";
    messageColor = "var(--success)";
  } else if (isTwoSame) {
    pointsWon = 10;
    winMessage = "2 Same! (+10 pts)";
    messageColor = "var(--success)";
  } else if (isAllFruits) {
    pointsWon = 5;
    winMessage = "All Fruits! (+5 pts)";
    messageColor = "var(--success)";
  } else {
    winMessage = "No match. Try again!";
    messageColor = "var(--text-light)";
  }

  score += pointsWon;
  messageDisplay.textContent = winMessage;
  messageDisplay.style.color = messageColor;

  updateScoreDisplay();

  if (score >= 10) {
    spinBtn.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", init);