// app.js

// 1️⃣ Tell Devvit you’re ready for the initial state
window.addEventListener('load', () => {
  window.parent.postMessage({ type: 'webViewReady' }, '*');
});

// 2️⃣ Listen for messages from Devvit
window.addEventListener('message', (event) => {
  const msg = event.data;
  if (msg.type === 'initialState') {
    const { score } = msg.payload;
    loadState({ score });
  }
});

// 3️⃣ Whenever your score updates, save both locally and inform Devvit
function saveState(state) {
  localStorage.setItem('gameState', JSON.stringify(state));
  window.parent.postMessage({ type: 'stateUpdate', payload: state }, '*');
}

// 4️⃣ Load from localStorage if present, else fall back to initial
function loadState(initial = { score: 0 }) {
  const saved = localStorage.getItem('gameState');
  const state = saved ? JSON.parse(saved) : initial;
  // e.g. update your UI
  score = state.score;
  updateScoreDisplay();
}
//