const modal = document.getElementById("gameOverModal");
const guessInput = document.getElementById("guessInput");
const movieQuote = document.getElementById("movieQuote");
const modalContent = document.querySelector(".modal-content");
const warningMessage = document.getElementById("warningMessage");

let quotes = [];

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
  currentQuoteIndex = 0;
  getNextQuote();
}

function getTodayQuote() {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return quotes.find((quote) => quote.date === todayStr);
}

let todayQuote = null;
function getNextQuote() {
  const todayStr = new Date().toISOString().split("T")[0];
  console.log("Today's date:", todayStr); // ✅ See what date we are matching

  todayQuote = quotes.find((quote) => quote.date === todayStr);
  console.log("Today's quote found:", todayQuote); // ✅ Check what quote is matched

  if (todayQuote) {
    movieQuote.innerHTML = `<p>"${todayQuote.quote}"</p>`;
  } else {
    movieQuote.innerHTML = `<p>No quote found for today.</p>`;
  }
}

let remainingGuesses = 3;
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const todayQuote = getTodayQuote();

  if (!userGuess) {
    showWarningMessage();
    return;
  }

  if (todayQuote && userGuess === todayQuote.movie.toLowerCase()) {
    showResultModal("You're a movie whiz! Come back tomorrow for a new quote! 📽️", true);
    remainingGuesses = 3; // Reset for the next round
  } else {
    remainingGuesses--;
    guessInput.value = ""; // Clear the input field
    warningMessage.style.display = "none"; // Hide warning message if it was shown
    guessInput.focus(); // Focus back on the input field
    
    if (remainingGuesses > 0) {
      showResultModal(`❌ Wrong! ${remainingGuesses} guesses left!`, false);
    } else {
      showGameOverModal();
      remainingGuesses = 3; // Reset for next game
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
  warningMessage.style.display = "block";
  warningMessage.classList.add("warning");
  warningMessage.textContent = "Enter a movie title, silly 👀";
}

function showResultModal(message, isCorrect) {
  modal.style.display = "block";
  modalContent.innerHTML = `<h2>${message}</h2>`;
  if (isCorrect) guessInput.disabled = true;
}

function showGameOverModal() {
  let answerTxt = todayQuote ? todayQuote.movie : "Unknown";

  modalContent.innerHTML = `
    <p class="message">Game Over! 😔</p>
    <p>The correct answer was: <strong>${answerTxt}</strong></p>
  `;
  modal.style.display = "flex";
  document.addEventListener("keyup", closeModalOnEnter);
}