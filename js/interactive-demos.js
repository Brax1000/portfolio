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
  // DEMO 2: C-FOUR BOMB DEFUSAL SIMULATOR (TACTICAL MINIGAME C ENGINE)
  // =========================================================================
  const termOutput = document.getElementById('terminalOutput');
  const termForm = document.getElementById('termInputForm');
  const termInput = document.getElementById('termInput');
  const termAttemptsSpan = document.getElementById('termAttempts');
  const termStatusSpan = document.getElementById('termStatus');
  const termTimerSpan = document.getElementById('termTimer');
  const termRangeSpan = document.getElementById('termRange');
  const termWelcomeRangeSpan = document.getElementById('termWelcomeRange');
  const termResetBtn = document.getElementById('termResetBtn');
  const diffBtns = document.querySelectorAll('.diff-btn');

  const DIFFICULTIES = [
    { name: "EASY", min: 1, max: 10, attempts: 5 },
    { name: "NORMAL", min: 1, max: 50, attempts: 7 },
    { name: "HARD", min: 1, max: 100, attempts: 8 },
    { name: "INSANE", min: 1, max: 500, attempts: 10 }
  ];

  let currentDiffIndex = 1; // Default NORMAL (1-50)
  let secretCode = 0;
  let lowBound = 1;
  let highBound = 50;
  let attemptsLeft = 7;
  let maxTries = 7;
  let guessCount = 0;
  let timerSeconds = 90;
  let timerInterval = null;
  let isGameOver = false;

  function stopBombTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  }

  function startBombTimer() {
    stopBombTimer();
    timerInterval = setInterval(() => {
      if (isGameOver) {
        stopBombTimer();
        return;
      }
      timerSeconds--;
      if (termTimerSpan) {
        termTimerSpan.textContent = `${timerSeconds}s`;
        if (timerSeconds <= 15) {
          termTimerSpan.classList.add('timer-pulse-danger');
        } else {
          termTimerSpan.classList.remove('timer-pulse-danger');
        }
      }

      if (timerSeconds <= 0) {
        stopBombTimer();
        isGameOver = true;
        appendTermLine(`[CRITICAL ALERT] !! FUSE EXPIRED (0s) - BOMB DETONATED !!`, 'danger-line');
        appendTermLine(`[INTEL] The secret deactivation code was: [${secretCode}]`, 'danger-line');
        if (termStatusSpan) {
          termStatusSpan.textContent = 'DETONATED';
          termStatusSpan.className = 'term-line danger-line';
        }
        if (termInput) termInput.disabled = true;
      }
    }, 1000);
  }

  function initBombGame(levelIndex = currentDiffIndex) {
    stopBombTimer();
    currentDiffIndex = levelIndex;
    const diff = DIFFICULTIES[currentDiffIndex];
    lowBound = diff.min;
    highBound = diff.max;
    attemptsLeft = diff.attempts;
    maxTries = diff.attempts;
    guessCount = 0;
    timerSeconds = 90;
    isGameOver = false;

    // Generate random secret within range
    secretCode = Math.floor(Math.random() * (diff.max - diff.min + 1)) + diff.min;

    if (termAttemptsSpan) termAttemptsSpan.textContent = attemptsLeft;
    if (termRangeSpan) termRangeSpan.textContent = `${lowBound} - ${highBound}`;
    if (termWelcomeRangeSpan) termWelcomeRangeSpan.textContent = `${diff.min} and ${diff.max}`;
    if (termTimerSpan) {
      termTimerSpan.textContent = '90s';
      termTimerSpan.classList.remove('timer-pulse-danger');
    }
    if (termStatusSpan) {
      termStatusSpan.textContent = 'ARMED';
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
        <div class="term-line">[THREAT LEVEL] <strong class="highlight-cyan">${diff.name} (${diff.min} - ${diff.max})</strong> | Max Tries: ${diff.attempts}</div>
        <div class="term-line">[ALERT] Device armed! 90-second fuse running.</div>
        <div class="term-line">[MISSION] Enter a number to narrow boundary radar clues.</div>
        <div class="term-divider"></div>
      `;
    }

    if (termInput) {
      termInput.value = '';
      termInput.disabled = false;
      termInput.placeholder = `Enter number (${diff.min} - ${diff.max})...`;
      termInput.min = diff.min;
      termInput.max = diff.max;
      setTimeout(() => termInput.focus(), 200);
    }

    // Update active button state
    diffBtns.forEach(btn => {
      const lvl = parseInt(btn.getAttribute('data-level'), 10);
      if (lvl === currentDiffIndex) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    startBombTimer();
  }

  // Difficulty switch buttons
  diffBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lvl = parseInt(btn.getAttribute('data-level'), 10);
      initBombGame(lvl);
    });
  });

  const bombCloseBtn = document.getElementById('closeBombModal');
  if (bombCloseBtn) {
    bombCloseBtn.addEventListener('click', stopBombTimer);
  }
  if (bombModal) {
    bombModal.addEventListener('click', (e) => {
      if (e.target === bombModal) stopBombTimer();
    });
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
      if (isGameOver || attemptsLeft <= 0 || timerSeconds <= 0) return;

      const rawGuess = termInput.value.trim();
      if (!rawGuess || isNaN(rawGuess)) {
        appendTermLine(`[ERROR] Please enter a valid number!`, 'danger-line');
        return;
      }

      const guess = parseInt(rawGuess, 10);
      const diff = DIFFICULTIES[currentDiffIndex];

      if (guess < diff.min || guess > diff.max) {
        appendTermLine(`[OUT OF BOUNDS] ${guess} is outside mission range (${diff.min} - ${diff.max})!`, 'danger-line');
        termInput.value = '';
        return;
      }

      guessCount++;
      appendTermLine(`> Operative guessed: [${guess}]`);

      if (guess === secretCode) {
        isGameOver = true;
        stopBombTimer();
        const score = attemptsLeft * 150 + timerSeconds * 10 + (currentDiffIndex + 1) * 100;
        const ratio = guessCount / maxTries;
        const stars = ratio <= 0.4 ? "⭐⭐⭐ [3/3 STARS]" : (ratio <= 0.7 ? "⭐⭐ [2/3 STARS]" : "⭐ [1/3 STARS]");

        appendTermLine(`[SUCCESS] *** CODE CONFIRMED! BOMB DEFUSED! ***`, 'success-line');
        appendTermLine(`[INTEL] Outstanding work! Time left: ${timerSeconds}s | Guesses: ${guessCount}`, 'success-line');
        appendTermLine(`[RATING] Score: ${score} PTS | Performance: ${stars}`, 'clue-line');

        if (termStatusSpan) {
          termStatusSpan.textContent = 'DEFUSED!';
          termStatusSpan.className = 'term-line success-line';
        }
        termInput.disabled = true;
        return;
      }

      attemptsLeft--;
      if (termAttemptsSpan) termAttemptsSpan.textContent = attemptsLeft;

      if (guess < secretCode) {
        lowBound = Math.max(lowBound, guess + 1);
        appendTermLine(`[RADAR SCAN] >> TOO LOW! << Secret is HIGHER than ${guess}.`, 'clue-line');
      } else {
        highBound = Math.min(highBound, guess - 1);
        appendTermLine(`[RADAR SCAN] >> TOO HIGH! << Secret is LOWER than ${guess}.`, 'clue-line');
      }

      appendTermLine(`[TARGET BOUNDS] Narrowed Range: [${lowBound} to ${highBound}] | Tries Left: ${attemptsLeft}`, 'welcome-line');
      if (termRangeSpan) termRangeSpan.textContent = `${lowBound} - ${highBound}`;

      if (attemptsLeft <= 0) {
        isGameOver = true;
        stopBombTimer();
        appendTermLine(`[DETONATION ALERT] !! TRIES EXHAUSTED (BOOM) !! Bomb exploded!`, 'danger-line');
        appendTermLine(`[INTEL] The secret deactivation code was: [${secretCode}]`, 'danger-line');
        if (termStatusSpan) {
          termStatusSpan.textContent = 'DETONATED';
          termStatusSpan.className = 'term-line danger-line';
        }
        termInput.disabled = true;
      }

      termInput.value = '';
    });
  }

  if (termResetBtn) termResetBtn.addEventListener('click', () => initBombGame(currentDiffIndex));
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
