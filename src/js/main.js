// ---------- Configuration ----------
const SECRET_CODE = "1234";             // Change this to your unlock code
const MAX_DIGITS = SECRET_CODE.length;
const FEEDBACK_TIME_S = 0.7;   // How long to show correct/incorrect feedback after submitting

const lcdElement = document.getElementById("lcd");   // Find lcd element in the html page
const lockElement = document.getElementById("lock"); // Find lock element in the html page

let codeInputBuffer = "";   // Code the user has currently entered
let clearTimer = null;      // Timer to delay clearing the code after pressing submit

// ---------- Methods ----------
function renderLCD(visualState) {
    // Show the currently entered code on the LCD, padded with underscores
    lcdElement.textContent = codeInputBuffer.padEnd(MAX_DIGITS, "_");

    // Colour the lcd green/red if code was submitted correctly/incorrectly (respectively)
    lcdElement.classList.toggle("success", visualState === "correct");
    lcdElement.classList.toggle("error", visualState === "incorrect");
}

function addNumberToCode(digit) {
    cancelScheduledClear(); // Interrupt clear timer on user input
    if (codeInputBuffer.length >= MAX_DIGITS) return;
    codeInputBuffer += digit;
    renderLCD();
}

function removeNumberFromCode() {
    cancelScheduledClear(); // Interrupt clear timer on user input
    if (codeInputBuffer.length === 0) return;
    codeInputBuffer = codeInputBuffer.slice(0, -1);
    renderLCD();
}

function submitCode() {
    cancelScheduledClear(); // Interrupt clear timer on user input
    const isCorrect = codeInputBuffer === SECRET_CODE; // Check if entered code is correct
    // Show code with relevant visual state, feedback on whether the submitted code was correct
    renderLCD(isCorrect ? "correct" : "incorrect");
    // Keep code + feedback visible for a short time before clearing
    clearCodeAfterDelay();
}

function clearCode() {
    cancelScheduledClear(); // Interrupt clear timer on user input
    codeInputBuffer = "";
    renderLCD();
}

function clearCodeAfterDelay() {
    cancelScheduledClear();
    clearTimer = setTimeout(clearCode, FEEDBACK_TIME_S * 1000); // Start timer to delay clear()
}

function cancelScheduledClear() {
    if (clearTimer !== null) {
        clearTimeout(clearTimer);   // If called while timer is running, cancel the timer
        clearTimer = null;
        codeInputBuffer = "";       // also clear the code so user can input again immediately
        renderLCD();
    }
}

// -------------------- Event Wiring ---------------------
// Handle clicking buttons with the mouse
lockElement.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return; // Ensure we clicked a button

    // look for custom attributes on the button's html tag
    const digit = btn.getAttribute("data-key");
    const action = btn.getAttribute("data-action");

    if (digit) return addNumberToCode(digit);    // clicked a digit button, add digit to code
    if (action == "submit") return submitCode(); // clicked the submit button
    if (action == "clear") return clearCode();   // clicked the clear button
});

// Handle keyboard presses
window.addEventListener("keydown", (e) => {
    // Check if pressed keyboard key was a number from 0 to 9 with regex magic
    if (/^[0-9]$/.test(e.key)) {
        addNumberToCode(e.key); // add the typed number to the code
        e.preventDefault(); // Capture the keypress to stop it from being read elsewhere
        return;
    }

    // Map keyboard keys to relevant functions
    const keyActions = {
        Backspace: removeNumberFromCode,    // Backspace removes last character
        Enter: submitCode,                  // Enter submits the code
        Escape: clearCode                   // Escape clears the code
    };

    if (keyActions[e.key]) {
        keyActions[e.key](); // Dispatch function if it exists in the mapping above
        e.preventDefault(); // Capture the keypress to stop it from being read elsewhere
    }
});

clearCode();