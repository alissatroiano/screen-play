/** @typedef {import('../src/message.ts').DevvitSystemMessage} DevvitSystemMessage */
/** @typedef {import('../src/message.ts').WebViewMessage} WebViewMessage */

class App {
  constructor() {
    // Get references to the HTML elements
    this.output = /** @type {HTMLPreElement} */ (document.querySelector('#messageOutput'));
    this.usernameLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#username'));
    this.scoreLabel = /** @type {HTMLSpanElement} */ (document.querySelector('#score'));
    this.scoreBtn = /** @type {HTMLButtonElement} */ (document.querySelector('#guessBtn'));
  
    this.scoreBtn.addEventListener('click', () => {
      // Sends a message to the Devvit app
      postWebViewMessage({ type: 'setScore', data: { newScore: this.score + 1 } });
    });
  }

  /**
   * @arg {MessageEvent<DevvitSystemMessage>} ev
   * @return {void}
   */
  #onMessage = (ev) => {
    // Reserved type for messages sent via `context.ui.webView.postMessage`
    if (ev.data.type !== 'devvit-message') return;
    const { message } = ev.data.data;

    // Always output full message
    this.output.replaceChildren(JSON.stringify(message, undefined, 2));

    switch (message.type) {
      case 'initialData': {
        // Load initial data
        const { username, currentScore } = message.data;
        this.usernameLabel.innerText = username;
        this.score = currentScore;
        this.scoreLabel.innerText = `${this.score}`;
        break;
      }
      case 'updateScore': {
        const { currentScore } = message.data;
        this.score = currentScore;
        this.scoreLabel.innerText = `${this.score}`;
        break;
      }
      default:
        /** to-do: @satisifes {never} */
        const _ = message;
        break;
    }
  };
}

/**
 * Sends a message to the Devvit app.
 * @arg {WebViewMessage} msg
 * @return {void}
 */
function postWebViewMessage(msg) {
  parent.postMessage(msg, '*');
}

new App();
