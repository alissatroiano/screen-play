const modal = document.getElementById("gameOverModal");
const guessInput = document.getElementById("guessInput");
const scoreBoard = document.getElementById("scoreBoard");
const movieImage = document.getElementById("movieImage");
const modalContent = document.querySelector(".modal-content");


/**
 * @type {{ name: string; image: string; }[]}
 */
let movies = [];

fetch("movies.json")
  .then((response) => response.json())
  .then((data) => {
    movies = data;
    shuffleMovies();
    getNextMovie();
  })
  .catch((error) => console.error("Error loading movies:", error));


let score;
let currentMovieIndex;
let warningShown = false;


function preloadImages() {
  movies.forEach((movie) => {
    const img = new Image();
    img.src = movie.image;
  });
}


function shuffleMovies() {
  for (let i = movies.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [movies[i], movies[j]] = [movies[j], movies[i]];
  }
}

function startGame() {
  score = 0;
  updateScore();
  currentMovieIndex = 0;
  getNextMovie();
}

//! Function to get the daily movie
function getNextMovie() {
  const currentMovie = movies[getCurrentDayIndex()];
  movieImage.src = currentMovie.image;
}

let remainingGuesses = 3; // Initialize remaining guesses

function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const currentMovie = movies[getCurrentDayIndex()];

  if (!userGuess) {
    showWarningMessage();
    return;
  }

  if (userGuess === currentMovie.name.toLowerCase()) {
    movieImage.style.boxShadow = "-1px 1px 25px 14px #52ffa880";
    movieImage.style.outline = "3px solid #52ffa9";
    showResultModal("🎉 Correct! See you soon!", true);
    remainingGuesses = 3; // Reset for the next round
  } else {
    remainingGuesses--;

    if (remainingGuesses > 0) {
      movieImage.style.boxShadow = "-1px 1px 25px 16px #a20927";
      movieImage.style.outline = "3px solid #a20927";
      showResultModal(`❌ Wrong! ${remainingGuesses} guesses left!`, false);
    } else {
      showGameOverModal();
      remainingGuesses = 3; // Reset for next game
    }
  }
}

//! Function to show result modal and end game
function showResultModal(message, won) {
  modalContent.innerHTML = `
    <p class="message">${message}</p>
  `;
}

//! Function to get today's movie index
function getCurrentDayIndex() {
  const today = new Date();
  return today.getDate() % movies.length; // Cycles through movies each day
}


//! Function to update the score display
function updateScore() {
  scoreBoard.textContent = `Score: ${score}`;
}

//! Function to show the warning message
function showWarningMessage() {
  modalContent.innerHTML = `
    <p class="message">Please enter a movie name! 👀</p>
  `;

  modal.style.display = "flex";
  document.addEventListener("keyup", closeModalOnEnter);
}

//! Function to show the game over modal
function showGameOverModal() {
  modalContent.innerHTML = `
    <p class="message">Game Over! 😔</p>
    <p>The correct answer was: <strong>${movies[getCurrentDayIndex()].name}</strong></p>
  
  `;
  modal.style.display = "flex";
  document.addEventListener("keyup", closeModalOnEnter);
}

//! Function to show the modal when the user win the game
function showWinGameModal() {
  modalContent.innerHTML = `
    <p class="message">You won the game! 🎉</p>
    <p>Total Score: ${score}</p>
  `;

  modal.style.display = "flex";
  scoreBoard.classList.remove("animation");
  document.addEventListener("keyup", closeModalOnEnter);
}

//! Function to close the modal on Enter key press
function closeModalOnEnter(e) {
  if (e.key === "Enter" && modal.style.display === "flex") {
    modal.style.display = "none";
    modalContent.innerHTML = "";
    guessInput.value = "";
    resetStyles();
    document.removeEventListener("keyup", closeModalOnEnter);

    if (!warningShown) {
      startGame();
    } else {
      warningShown = false;
    }
  }
}

//! Function to close the modal by clicking "OK" button
function closeModal() {
  modal.style.display = "none";
  modalContent.innerHTML = "";
  guessInput.value = "";
  resetStyles();
  document.removeEventListener("keyup", closeModalOnEnter);

  if (!warningShown) {
    startGame();
  } else {
    warningShown = false;
  }
}

//! Event listener for the Enter key to automatically check the guess
document.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && modal.style.display !== "flex") {
    checkGuess();
  }
});

//! Function to focus on input
function focusOnInput() {
  guessInput.focus();
}

//! Function to reset the styles
function resetStyles() {
  movieImage.style.boxShadow = "";
  movieImage.style.outline = "";
}

//! Get the cursor position in the input
guessInput.addEventListener("keyup", (e) => {
  console.log("Caret at: ", e.target.selectionStart);
});

//! Start the game when the page loads
window.onload = function () {
  shuffleMovies();
  getNextMovie();
};