import passages from './passages.js';

let timeLeft, timerInterval, startTime;
let isTyping = false;
let selectedPassage = "";
let correctChars = 0;
let totalChars = 0;

const passageElement = document.getElementById("passage");
const typingArea = document.getElementById("typingArea");
const timeSelect = document.getElementById("timeSelect");
const categorySelect = document.getElementById("categorySelect");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const timerDisplay = document.getElementById("timer");
const statsDisplay = document.getElementById("stats");

// Function to select a random passage
function selectRandomPassage() {
    const category = categorySelect.value;
    const passageList = passages[category];
    return passageList[Math.floor(Math.random() * passageList.length)];
}

// Function to start the test
function startTest() {
    selectedPassage = selectRandomPassage();
    passageElement.innerText = selectedPassage;
    
    typingArea.value = "";
    typingArea.removeAttribute("disabled");  // Enable typing area
    typingArea.focus();

    timeLeft = parseInt(timeSelect.value);
    timerDisplay.innerText = `Time: ${timeLeft}s`;
    statsDisplay.innerText = `WPM: 0 | Accuracy: 100%`;

    if (timerInterval) clearInterval(timerInterval);

    isTyping = false;
    typingArea.addEventListener("input", handleTyping);
}

// Function to handle typing
function handleTyping() {
    if (!isTyping) {
        startTime = Date.now();
        isTyping = true;
        startTimer();
    }

    let typedText = typingArea.value;
    correctChars = 0;
    totalChars = typedText.length;

    let highlightedText = "";
    for (let i = 0; i < selectedPassage.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === selectedPassage[i]) {
                highlightedText += typedText[i];
                correctChars++;
            } else {
                highlightedText += `<span class="wrong-char">${selectedPassage[i]}</span>`;
            }
        } else {
            highlightedText += selectedPassage[i];
        }
    }

    passageElement.innerHTML = highlightedText;
}

// Function to start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            typingArea.setAttribute("disabled", true);
            calculateResults();
        } else {
            timeLeft--;
            timerDisplay.innerText = `Time: ${timeLeft}s`;
        }
    }, 1000);
}

// Function to calculate and display WPM and accuracy
function calculateResults() {
    let elapsedTime = (Date.now() - startTime) / 60000; // Convert to minutes
    let wpm = Math.round((correctChars / 5) / elapsedTime);
    let accuracy = totalChars ? Math.round((correctChars / totalChars) * 100) : 100;
    statsDisplay.innerText = `WPM: ${wpm} | Accuracy: ${accuracy}%`;
}

// Restart the test
restartButton.addEventListener("click", startTest);
startButton.addEventListener("click", startTest);