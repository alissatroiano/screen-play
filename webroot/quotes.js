const modal = document.getElementById("gameOverModal");
const guessInput = document.getElementById("guessInput");
const movieQuote = document.getElementById("movieQuote");
const modalContent = document.querySelector(".modal-content");
const scoreBoard = document.getElementById("scoreBoard");

let quotes = [];
let score = 0;
let remainingGuesses = 3;

fetch("quotes.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Quotes loaded:", data); // ✅ Add this
    quotes = data;
    shuffleQuotes();
    startGame(); // ✅ This must be inside the fetch
  })
  .catch((error) => console.error("Error loading quotes:", error));

function shuffleQuotes() {
  for (let i = quotes.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quotes[i], quotes[j]] = [quotes[j], quotes[i]];
  }
}

function startGame() {
  updateScoreDisplay();
  getNextQuote();
}


function updateScoreDisplay() {
  scoreBoard.textContent = `Score: ${score}`;
}

function getTodayQuote() {
  const todayStr = new Date().toISOString().split("T")[0];
  return quotes.find((quote) => quote.date === todayStr);
}

function getNextQuote() {
  const todayStr = new Date().toISOString().split("T")[0];
  console.log("Today's date:", todayStr); // ✅ See what date we are matching

  const todayQuote = quotes.find((quote) => quote.date === todayStr);
  console.log("Today's quote found:", todayQuote); // ✅ Check what quote is matched

  if (todayQuote) {
    movieQuote.innerHTML = `<p>${todayQuote.quote}</p>`;
  } else {
    movieQuote.innerHTML = `<p>No quote found for today.</p>`;
  }
}

function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const todayQuote = getTodayQuote();

  if (!todayQuote || !userGuess) {
    showWarningMessage();
    return;
  }

  if (userGuess === todayQuote.movie.toLowerCase()) {
    this.score = 1;
    score = this.score;
    updateScoreDisplay();
    showResultModal("🎉 Correct! See you soon!", true);
    remainingGuesses = 3;
  } else {
    remainingGuesses--;

    if (remainingGuesses > 0) {
      showResultModal(`❌ Wrong! ${remainingGuesses} guesses left!`, false);
    } else {
      showGameOverModal();
      remainingGuesses = 3;
    }
  }
}


//! Event listener for the Enter key to automatically check the guess
document.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && modal.style.display !== "flex") {
    checkGuess();
  }
});

// attach checkGuess function to guessBtn
const guessBtn = document.getElementById("checkGuess");
guessBtn.addEventListener("click", checkGuess);

//! Function to focus on input
function focusOnInput() {
  guessInput.focus();
}

function showWarningMessage() {
  alert("Please enter your guess before submitting.");
}

function showResultModal(message, isCorrect) {
  modal.style.display = "block";
  modalContent.innerHTML = `<h2>${message}</h2>`;
  if (isCorrect) guessInput.disabled = true;
}

function showGameOverModal() {
  modal.style.display = "block";
  modalContent.innerHTML = `<h2>Game Over</h2><p>Your score: ${score}</p>`;
  guessInput.disabled = true;
}

