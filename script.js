'use strict';

let main = document.getElementById('main');
let textContainer = document.getElementById('text-container');
let resultsContainer = document.getElementById('results');
let wpmText = document.getElementById('wpm');
let accuracyText = document.getElementById('accuracy');
let timeText = document.getElementById('time');

let restartBtn = document.getElementById('restartBtn');
let darkModeBtn = document.getElementById('darkModeBtn');
let catModeBtn = document.getElementById('catModeBtn');
let catFactBtn = document.getElementById('catFactBtn');

const texts = [
  "Meow! Cats have been humans' companions for thousands of years.",
  "The quick brown fox jumps over the lazy dog... but the cat just watches.",
  "Some people say cats are aloof, others know them as cuddly friends!",
  "Cats are the most popular pet in the United States: There are 88 million pet cats and 74 million dogs.",
  "The oldest known pet cat existed 9,500 years ago.",
  "A cat can jump up to six times its length in one leap.",
  "Cats have five toes on their front paws, but only four on their back paws.",
  "Cats have a specialized collar bone that allows them to always land on their feet.",
  "Cats have a unique grooming pattern: they lick their fur to keep clean.",
  "Cat whiskers are highly sensitive and help cats detect changes in their surroundings.",
  "Cats have a special reflective layer behind their retinas that helps them see in low light.",
  "Cats have a unique vocal pattern that they use to communicate with humans.",
  "Cats have a special scent gland on their face that they use to mark their territory.",
  "Cats have a specialized digestive system that allows them to eat grass. Also, they love CAT GRASS!",
  "Cats have a unique hunting pattern: they stalk their prey and pounce when they are close enough.",
  "Cats have a special sleeping pattern: they sleep for 12-16 hours a day. I wish I could do that...",
  "A cat's purr can help reduce stress and anxiety in humans and release serotonin, pet your cats today! Or I will!",
  "Cats have a special way of showing affection: they rub their face on you to mark you as their territory! Possesive huh?!",
  "Cats have a cool way of showing trust; they blink slowly at you, try blinking slowly back at them to show your love!",
  "Cats often bring you 'gifts' of dead animals, this is a sign of love and trust so don't get angry at them.",
  "Cats kneading you with their paws is a sign of affection! Get back to making those biscuits.",
  "When cats show their bellies, they trust you! So take your chance! Pet that belly.",
  "What do you call a pile of cats? A meowtain!",
  "What do you call a cat that can rough it in the wilderness? A surviva kit!",
  "What do you call a cat that can paint? An artist!",
  "What do you call a cat that can play the guitar? A rock star!",
  "What do you call a cat that loves the water? A purrmaid!",
  "What do you call a cat that can fly? A hot cat balloon!",
  "Why do cats always get their way? They are very purr-suasive!",
  "Why was the cat sitting on the computer? To keep an eye on the mouse!",
  "Why did the cat join the Red Cross? She wanted to be a first-aid kit.",
  "Why did the cat run from the tree? Because it was afraid of the bark!"
];

let currentText = "";
let textArr = [];
let currentPos = 0;
let errors = [];
let backspaceNeeded = false;
let currentTime = 0;
let firstTime = true;
let repeat = null;

const invalidKeys = 'F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 Escape Tab CapsLock Shift Control Alt Meta ArrowLeft ArrowRight ArrowDown ArrowUp Enter'.split(' ');

function initTest(customText = null) {
  clearInterval(repeat);
  repeat = null;

  currentTime = 0;
  currentPos = 0;
  firstTime = true;
  backspaceNeeded = false;
  errors = [];

  if (customText) {
    currentText = customText;
  } else {
    currentText = texts[Math.floor(Math.random() * texts.length)];
  }

  textArr = currentText.split('');

  const htmlArr = textArr.map((char, index) => {
    if (char === ' ') {
      return `<span class="space" id="span${index}">${char}</span>`;
    } else {
      return `<span class="char" id="span${index}">${char}</span>`;
    }
  });

  textContainer.innerHTML = htmlArr.join('');

  main.style.display = 'block';
  resultsContainer.style.display = 'none';
}

document.addEventListener('keydown', (event) => {
  if (event.key === ' ') {
    event.preventDefault();
  }

  if (firstTime && !invalidKeys.includes(event.key)) {
    firstTime = false;
    repeat = setInterval(() => currentTime++, 1000);
  }

  if (event.location === 0 && !invalidKeys.includes(event.key)) {
    handleKey(event.key);
  }
});

function handleKey(key) {
  if (currentPos >= textArr.length) return;

  let spanStyle = document.getElementById(`span${currentPos}`).style;

  if (!backspaceNeeded) {
    if (key === textArr[currentPos]) {
      spanStyle.color = 'limegreen';
      currentPos++;
    } else {
      if (key === 'Backspace') return;

      if (textArr[currentPos] === ' ') {
        spanStyle.backgroundColor = 'red';
      } else {
        spanStyle.color = 'red';
      }
      backspaceNeeded = true;
      errors.push(textArr[currentPos]);
    }
  } else {
    if (key === 'Backspace') {
      if (textArr[currentPos] === ' ') {
        spanStyle.backgroundColor = 'transparent';
      } else {
        spanStyle.color = '#ffd700';
      }
      backspaceNeeded = false;
    }
  }

  if (currentPos === textArr.length) {
    clearInterval(repeat);
    handleEnd();
  }
}

function handleEnd() {
  let wpm = Math.floor(textArr.length / 5 / (currentTime / 60));
  let accuracy = Math.floor(((textArr.length - errors.length) / textArr.length) * 100);

  let minutes = Math.floor(currentTime / 60);
  let seconds = currentTime - minutes * 60;

  wpmText.innerHTML = `${wpm} wpm`;
  accuracyText.innerHTML = `${accuracy}%`;
  timeText.innerHTML = `${minutes} m ${seconds} s`;

  main.style.display = 'none';
  resultsContainer.style.display = 'block';
}

restartBtn.addEventListener('click', () => {
  initTest();
});

// Dark Mode
darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});

catModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('cat-mode');
});

// Cat Fact from catfact.ninja
catFactBtn.addEventListener('click', async () => {
  try {
    let response = await fetch('https://catfact.ninja/fact');
    let data = await response.json();
    initTest(data.fact);
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    alert('Could not load cat fact. Try again later!');
  }
});

initTest();