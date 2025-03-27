const modal = document.getElementById("gameOverModal");
const guessInput = document.getElementById("guessInput");
const scoreBoard = document.getElementById("scoreBoard");
const movieImage = document.getElementById("movieImage");
const modalContent = document.querySelector(".modal-content");

const movies = [
  { name: "Pulp Fiction", image: "../assets/pulp-fiction-1.png"
  },
  { name: "Trainspotting", image: "../assets/trainspotting.png"
  },
   { name: "halloween", image: "../assets/halloween.jpg"
   },
    { name : 'Children of Men', image: "../assets/Children-of-Men.jpg"},
    { name: 'The Dark Knight', image: "../assets/the-dark-knight.jpg"}
];

let score: number;
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

//! Function to check the user's guess and end the game
function checkGuess() {
  const userGuess = guessInput.value.trim().toLowerCase();
  const currentMovie = movies[getCurrentDayIndex()];

  if (userGuess === currentMovie.name.toLowerCase()) {
    movieImage.style.boxShadow = "-1px 1px 25px 14px #52ffa880";
    movieImage.style.outline = "3px solid #52ffa9";
    showResultModal("🎉 Correct! See you tomorrow!", true);
  } else {
    movieImage.style.boxShadow = "-1px 1px 25px 16px #a20927";
    movieImage.style.outline = "3px solid #a20927";
    showResultModal("❌ Wrong guess! Try again tomorrow!", false);
  }
}

//! Function to show result modal and end game
function showResultModal(message, won) {
  modalContent.innerHTML = `
    <p class="message">${message}</p>
    <button class="btn" onclick="closeModal()">Close</button>
  `;
  modal.style.display = "flex";
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
    <button class="btn" onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
  document.addEventListener("keyup", closeModalOnEnter);
}

//! Function to show the game over modal
function showGameOverModal() {
  modalContent.innerHTML = `
    <p class="message">Game Over! 😔</p>
    <p>Total Score: ${score}</p>
    <button class="btn" onclick="closeModal()">Close</button>
  `;

  modal.style.display = "flex";
  document.addEventListener("keyup", closeModalOnEnter);
}

//! Function to show the modal when the user win the game
function showWinGameModal() {
  modalContent.innerHTML = `
    <p class="message">You won the game! 🎉</p>
    <p>Total Score: ${score}</p>
    <button class="btn" onclick="closeModal()">Close</button>
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