const word = document.getElementById("word");
const incorrect = document.getElementById("incorrect");
const incorrectLettersEl = document.querySelector("#incorrect p");
const backdrop = document.getElementById("backdrop");
const finalMsg = document.getElementById("final-msg");
const msgInfo = document.getElementById("msg-info");
const playBtn = document.getElementById("play");
const indication = document.getElementById("indication");
const bodyParts = document.getElementsByClassName("body-part");

// List of words
const wordList = [
  { word: "amerika", hint: "Negri Paman Sam" },
  { word: "indonesia", hint: "Zamrud Katulistiwa" },
  { word: "malaysia", hint: "Negri Jiran" },
  { word: "laos", hint: "Tanah Terkunci" },
  { word: "thailand", hint: "Negri Gajah Putih" },
  { word: "brazil", hint: "Negri Samba" },
  { word: "filiphina", hint: "Negri Lumpung Padi" },
  { word: "irak", hint: "Negri 1001 Malam" },
  { word: "myanmar", hint: "Tanah Emas" },
  { word: "jepang", hint: "Negri Matahari Terbit" },
  { word: "china", hint: "Negri tirai bambu" },
];

// that is selected to play
let selectedWord = null;
// Stores the count of no.of incorrectly typed letters
let incorrectCount = 0;
// Correct letters typed by the player
const correctLetters = [];
// Incorrect letters typed by the player
const incorrectLetters = [];

// Batasan jumlah kesalahan menebak
const maxIncorrectGuesses = 6;

// Select a word randomly from wordList and initialize in the DOM
function initializeWord() {
  selectedWord = getRandomWord();
  const noOfLetters = selectedWord.word.length;
  for (let i = 0; i < noOfLetters; i++) {
    const listItem = document.createElement("li");
    listItem.classList.add("letter");
    word.append(listItem);
  }

  // Tampilkan hint kata kepada pemain
  document.getElementById("categoryHint").textContent = `Hint: ${selectedWord.hint}`;
}

// Displays an indication sliding from the bottom
function displayIndication() {
  indication.classList.add("visible");

  setTimeout(() => {
    indication.classList.remove("visible");
  }, 2400);
}

// Update the figure when incorrect letters typed
function updateFigure() {
  try {
    bodyParts[incorrectCount].style.display = "block";
    incorrectCount++;
  } catch (error) {}
}

// When player wins
function successState() {
  setTimeout(() => {
    backdrop.classList.add("visible");
    finalMsg.classList.add("visible");
    msgInfo.textContent = "Selamar Tebakanmu Benar";
  }, 400);
}

// When player loses
function failureState() {
  setTimeout(() => {
    backdrop.classList.add("visible");
    finalMsg.classList.add("visible");
    msgInfo.textContent = `Kamu Kalah. Kata yang benar adalah "${selectedWord.word}"`;
  }, 400);
}

// Check if typed key is part of the selected word and update in the DOM if required
function check(ev) {
  const letterElements = document.querySelectorAll(".word .letter");
  const character = ev.key;

  // Handle keyboard events
  if (!backdrop.classList.contains("visible") && !indication.classList.contains("visible") && ev.keyCode >= 65 && ev.keyCode <= 90 && incorrectCount < maxIncorrectGuesses) {
    if (selectedWord.word.includes(character)) {
      if (correctLetters.includes(character)) {
        displayIndication();
      } else {
        correctLetters.push(character);
        const indexes = [];
        [...selectedWord.word].forEach((value, index) => {
          if (value === character) {
            indexes.push(index);
          }
        });
        indexes.forEach((value) => {
          letterElements[value].textContent = character;
        });
      }
    } else {
      if (incorrectLetters.includes(character)) {
        displayIndication();
      } else {
        incorrectLetters.push(character);
        if (!incorrect.classList.contains("visible")) {
          incorrect.classList.add("visible");
        }
        incorrectLettersEl.textContent = `${incorrectLetters.join(", ")}`;
        updateFigure();
      }
    }
  }

  // Create a word from all letter items
  let formedWord = "";
  letterElements.forEach((value) => {
    formedWord += value.textContent;
  });

  // Check if created word is correct
  if (formedWord === selectedWord.word) {
    successState();
  }

  // Check if man was hung
  if (incorrectCount >= maxIncorrectGuesses) {
    failureState();
  }
}

// Reset all variables and start a new game
function startNewGame() {
  selectedWord = null;
  incorrectCount = 0;
  correctLetters.splice(0);
  incorrectLetters.splice(0);
  word.innerHTML = "";
  Array.from(bodyParts).forEach((value) => {
    value.style.display = "none";
  });
  incorrect.classList.remove("visible");
  backdrop.classList.remove("visible");
  finalMsg.classList.remove("visible");
  initializeWord();
}

// Start the game
initializeWord();

// Event Listeners
window.addEventListener("keyup", check);
playBtn.addEventListener("click", startNewGame);

// Fungsi untuk mengambil kata acak beserta hintnya
function getRandomWord() {
  const randomIndex = Math.floor(Math.random() * wordList.length);
  return wordList[randomIndex];
}
