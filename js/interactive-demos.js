/**
 * interactive-demos.js
 * In-browser interactive demos of Braxten's GitHub projects:
 * 1. C.C Calculator (HTML/CSS/JS)
 * 2. C-Four Bomb Defusal Simulator (C Engine Emulation)
 * 3. Python Hangman Game
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // MODAL CONTROLLERS (OPEN / CLOSE HELPERS)
  // =========================================================================
  const calcModal = document.getElementById('calcModal');
  const bombModal = document.getElementById('bombModal');
  const hangmanModal = document.getElementById('hangmanModal');

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Calculator modal triggers
  document.querySelectorAll('.open-calc-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(calcModal);
    });
  });
  const closeCalcBtn = document.getElementById('closeCalcModal');
  if (closeCalcBtn) closeCalcBtn.addEventListener('click', () => closeModal(calcModal));

  // Bomb defusal triggers
  document.querySelectorAll('.open-bomb-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(bombModal);
      const input = document.getElementById('termInput');
      if (input) setTimeout(() => input.focus(), 300);
    });
  });
  const closeBombBtn = document.getElementById('closeBombModal');
  if (closeBombBtn) closeBombBtn.addEventListener('click', () => closeModal(bombModal));

  // Hangman triggers
  document.querySelectorAll('.open-hangman-demo').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(hangmanModal);
    });
  });
  const closeHangmanBtn = document.getElementById('closeHangmanModal');
  if (closeHangmanBtn) closeHangmanBtn.addEventListener('click', () => closeModal(hangmanModal));

  // Close when clicking outside modal content
  [calcModal, bombModal, hangmanModal].forEach(modal => {
    if (!modal) return;
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });
  });

  // Close on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(calcModal);
      closeModal(bombModal);
      closeModal(hangmanModal);
    }
  });


  // =========================================================================
  // DEMO 1: C.C CALCULATOR ENGINE
  // =========================================================================
  const calcDisplay = document.getElementById('calcDisplay');
  const calcHistory = document.getElementById('calcHistory');
  let currentExpression = '0';
  let shouldResetScreen = false;

  function updateCalcScreen() {
    if (calcDisplay) calcDisplay.textContent = currentExpression;
  }

  function handleCalcInput(val) {
    if (currentExpression === '0' || shouldResetScreen) {
      currentExpression = val;
      shouldResetScreen = false;
    } else {
      currentExpression += val;
    }
    updateCalcScreen();
  }

  function handleCalcOperator(op) {
    if (shouldResetScreen) shouldResetScreen = false;
    const lastChar = currentExpression.slice(-1);
    if (['+', '-', '*', '/'].includes(lastChar)) {
      currentExpression = currentExpression.slice(0, -1) + op;
    } else {
      currentExpression += op;
    }
    updateCalcScreen();
  }

  function calculateResult() {
    try {
      if (calcHistory) calcHistory.textContent = currentExpression + ' =';
      // Sanitize expression
      const cleanExpr = currentExpression.replace(/[^0-9+\-*/.]/g, '');
      // Evaluate cleanly
      const result = Function(`'use strict'; return (${cleanExpr})`)();
      currentExpression = String(Number.isInteger(result) ? result : parseFloat(result.toFixed(6)));
      shouldResetScreen = true;
    } catch (err) {
      currentExpression = 'Error';
      shouldResetScreen = true;
    }
    updateCalcScreen();
  }

  document.querySelectorAll('.calc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const val = btn.getAttribute('data-val');

      if (val && !action) {
        handleCalcInput(val);
      } else if (action === 'op') {
        handleCalcOperator(val);
      } else if (action === 'equals') {
        calculateResult();
      } else if (action === 'clear') {
        currentExpression = '0';
        if (calcHistory) calcHistory.textContent = '0';
        updateCalcScreen();
      } else if (action === 'backspace') {
        if (currentExpression.length > 1) {
          currentExpression = currentExpression.slice(0, -1);
        } else {
          currentExpression = '0';
        }
        updateCalcScreen();
      } else if (action === 'percent') {
        try {
          currentExpression = String(parseFloat(currentExpression) / 100);
          updateCalcScreen();
        } catch (e) {}
      } else if (action === 'sqrt') {
        try {
          currentExpression = String(Math.sqrt(parseFloat(currentExpression)).toFixed(4));
          updateCalcScreen();
        } catch (e) {}
      }
    });
  });

  // Optional keyboard support for calculator when modal is open
  window.addEventListener('keydown', (e) => {
    if (!calcModal || !calcModal.classList.contains('active')) return;
    if (['0','1','2','3','4','5','6','7','8','9','.'].includes(e.key)) {
      handleCalcInput(e.key);
    } else if (['+','-','*','/'].includes(e.key)) {
      handleCalcOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      calculateResult();
    } else if (e.key === 'Backspace') {
      if (currentExpression.length > 1) {
        currentExpression = currentExpression.slice(0, -1);
      } else {
        currentExpression = '0';
      }
      updateCalcScreen();
    } else if (e.key.toLowerCase() === 'c') {
      currentExpression = '0';
      if (calcHistory) calcHistory.textContent = '0';
      updateCalcScreen();
    }
  });


  // =========================================================================
  // DEMO 2: C-FOUR BOMB DEFUSAL SIMULATOR (TACTICAL C ENGINE)
  // =========================================================================
  const termOutput = document.getElementById('terminalOutput');
  const termForm = document.getElementById('termInputForm');
  const termInput = document.getElementById('termInput');
  const termAttemptsSpan = document.getElementById('termAttempts');
  const termStatusSpan = document.getElementById('termStatus');
  const termResetBtn = document.getElementById('termResetBtn');

  let bombSecretCode = '';
  let bombAttemptsLeft = 5;
  let bombDefused = false;

  function initBombGame() {
    // Generate 4 unique random digits
    const digits = ['0','1','2','3','4','5','6','7','8','9'];
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    bombSecretCode = digits.slice(0, 4).join('');
    bombAttemptsLeft = 5;
    bombDefused = false;

    if (termAttemptsSpan) termAttemptsSpan.textContent = bombAttemptsLeft;
    if (termStatusSpan) {
      termStatusSpan.textContent = 'ACTIVE';
      termStatusSpan.className = 'highlight-cyan';
    }

    if (termOutput) {
      termOutput.innerHTML = `
        <div class="term-line welcome-line">====================================================</div>
        <div class="term-line welcome-line">   [C-FOUR: LAST CHANCE - TEAM GAMEDEV EDITION]    </div>
        <div class="term-line welcome-line">   BSIT - 1C (TUP Manila) // Featuring C-Four2     </div>
        <div class="term-line welcome-line">   Devs: Braxten Urdelas, John Hayden Nell, David Pansoy </div>
        <div class="term-line welcome-line">====================================================</div>
        <div class="term-line">[SYSTEM] Tactical C-Four2 Engine initialized...</div>
        <div class="term-line">[ALERT] Bomb armed! Deactivation protocol required.</div>
        <div class="term-line">[RULES] You have 5 defusal attempts. Enter code to test radar clues.</div>
        <div class="term-line">[HINT] Enter 4 digits (e.g. 1234) and submit code below.</div>
        <div class="term-divider"></div>
      `;
    }
    if (termInput) {
      termInput.value = '';
      termInput.disabled = false;
      termInput.focus();
    }
  }

  function appendTermLine(text, className = '') {
    if (!termOutput) return;
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.textContent = text;
    termOutput.appendChild(line);
    termOutput.scrollTop = termOutput.scrollHeight;
  }

  if (termForm) {
    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (bombDefused || bombAttemptsLeft <= 0) return;

      const guess = termInput.value.trim();
      if (guess.length !== 4 || isNaN(guess)) {
        appendTermLine(`[ERROR] Invalid entry: "${guess}". Must be 4 digits.`, 'danger-line');
        termInput.value = '';
        return;
      }

      appendTermLine(`> Guess submitted: [${guess}]`);

      if (guess === bombSecretCode) {
        bombDefused = true;
        appendTermLine(`[SUCCESS] *** CODE ACCEPTED! BOMB SUCCESSFULLY DEFUSED! ***`, 'success-line');
        appendTermLine(`[MISSION ACCOMPLISHED] Great tactical work, Agent!`, 'success-line');
        if (termStatusSpan) {
          termStatusSpan.textContent = 'DEFUSED';
          termStatusSpan.className = 'term-line success-line';
        }
        termInput.disabled = true;
        return;
      }

      // Calculate matches
      let correctPosition = 0;
      let correctDigitWrongPos = 0;

      for (let i = 0; i < 4; i++) {
        if (guess[i] === bombSecretCode[i]) {
          correctPosition++;
        } else if (bombSecretCode.includes(guess[i])) {
          correctDigitWrongPos++;
        }
      }

      bombAttemptsLeft--;
      if (termAttemptsSpan) termAttemptsSpan.textContent = bombAttemptsLeft;

      appendTermLine(`[RADAR SCAN] Correct Digit & Position: ${correctPosition} | Correct Digit Wrong Pos: ${correctDigitWrongPos}`, 'clue-line');

      if (bombAttemptsLeft <= 0) {
        appendTermLine(`[DETONATION ALERT] Attempts exhausted! Bomb exploded!`, 'danger-line');
        appendTermLine(`[INTEL] The defusal code was: [${bombSecretCode}]`, 'danger-line');
        if (termStatusSpan) {
          termStatusSpan.textContent = 'DETONATED';
          termStatusSpan.className = 'term-line danger-line';
        }
        termInput.disabled = true;
      } else {
        appendTermLine(`[WARNING] ${bombAttemptsLeft} attempts remaining! Keep analyzing.`, 'clue-line');
      }

      termInput.value = '';
    });
  }

  if (termResetBtn) termResetBtn.addEventListener('click', initBombGame);
  initBombGame();


  // =========================================================================
  // DEMO 3: PYTHON HANGMAN GAME
  // =========================================================================
  const wordsList = ['PYTHON', 'VARIABLE', 'ALGORITHM', 'SOFTWARE', 'VERCEL', 'FUNCTION', 'POINTER', 'CODING', 'PROGRAM'];
  const asciiStages = [
`  +---+
  |   |
      |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
      |
      |
      |
=========`,
`  +---+
  |   |
  O   |
  |   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|   |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
      |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 /    |
      |
=========`,
`  +---+
  |   |
  O   |
 /|\\  |
 / \\  |
      |
=========`
  ];

  let hangmanWord = '';
  let hangmanGuessed = new Set();
  let hangmanLives = 6;

  const hangmanAscii = document.getElementById('hangmanAscii');
  const hangmanWordDisplay = document.getElementById('hangmanWordDisplay');
  const hangmanLivesSpan = document.getElementById('hangmanLives');
  const hangmanGuessedSpan = document.getElementById('hangmanGuessedLetters');
  const hangmanKeyboard = document.getElementById('hangmanKeyboard');
  const hangmanRestartBtn = document.getElementById('hangmanRestartBtn');

  function initHangman() {
    hangmanWord = wordsList[Math.floor(Math.random() * wordsList.length)];
    hangmanGuessed.clear();
    hangmanLives = 6;
    renderHangman();
    buildHangmanKeyboard();
  }

  function renderHangman() {
    // Stage is 6 - lives
    const stageIndex = Math.min(6 - hangmanLives, 6);
    if (hangmanAscii) {
      hangmanAscii.innerHTML = `<pre>${asciiStages[stageIndex]}</pre>`;
    }

    // Word display
    let displayStr = '';
    let allGuessed = true;
    for (let char of hangmanWord) {
      if (hangmanGuessed.has(char)) {
        displayStr += char + ' ';
      } else {
        displayStr += '_ ';
        allGuessed = false;
      }
    }
    if (hangmanWordDisplay) hangmanWordDisplay.textContent = displayStr.trim();
    if (hangmanLivesSpan) hangmanLivesSpan.textContent = hangmanLives;
    if (hangmanGuessedSpan) {
      const letters = Array.from(hangmanGuessed).join(', ');
      hangmanGuessedSpan.textContent = letters.length > 0 ? letters : 'None';
    }

    if (allGuessed) {
      setTimeout(() => {
        alert(`🎉 Congratulations! You guessed the word: ${hangmanWord}`);
      }, 100);
    } else if (hangmanLives <= 0) {
      setTimeout(() => {
        alert(`💀 Game Over! The word was: ${hangmanWord}`);
      }, 100);
    }
  }

  function handleGuess(letter) {
    if (hangmanLives <= 0 || hangmanGuessed.has(letter)) return;
    hangmanGuessed.add(letter);

    if (!hangmanWord.includes(letter)) {
      hangmanLives--;
    }
    renderHangman();
  }

  function buildHangmanKeyboard() {
    if (!hangmanKeyboard) return;
    hangmanKeyboard.innerHTML = '';
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let l of letters) {
      const btn = document.createElement('button');
      btn.className = 'hang-letter-btn';
      btn.textContent = l;
      btn.addEventListener('click', () => {
        btn.disabled = true;
        handleGuess(l);
      });
      hangmanKeyboard.appendChild(btn);
    }
  }

  if (hangmanRestartBtn) hangmanRestartBtn.addEventListener('click', initHangman);
  initHangman();

});
