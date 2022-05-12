'use strict';
let secretNumber = Math.trunc(Math.random() * 50) + 1;
console.log(secretNumber);

let score = 25;
let highscore = 0;

const displayMessage = function (message) {
  document.querySelector('.message').textContent = message;
};

const displayNumber = function (number) {
  document.querySelector('.number').textContent = number;
};

const displayScore = function (score) {
  document.querySelector('.score').textContent = score;
};

document.querySelector('.check').addEventListener('click', function () {
  const guess = Number(document.querySelector('.guess').value);
  console.log(guess);
  // when there is no input.
  if (!guess) {
    displayMessage('⛔ No Number!');
  }
  // When Play wins the Game.
  else if (guess === secretNumber) {
    displayMessage('🎯 Correct Number!');

    displayNumber(secretNumber);
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').style.width = '30rem';

    if (score > highscore) {
      highscore = score;
      document.querySelector('.highscore').textContent = highscore;
    }
  } // When guess is wrong
  else if (guess !== secretNumber) {
    if (score > 1) {
      displayMessage(guess > secretNumber ? '📈 Too High!' : '📉 Too Low!');
      score--;

      displayScore(score);
    } else {
      displayMessage('You Lost!');
      displayScore(0);
    }
  } 
});

document.querySelector('.again').addEventListener('click', function () {
  score = 25;
  secretNumber = Math.trunc(Math.random() * 50) + 1;
  displayMessage('Start Guessing...');
  displayNumber('?');
  displayScore(25);
  document.querySelector('.guess').value = '';
  document.querySelector('body').style.backgroundColor = 'tomato';
  document.querySelector('.number').style.width = '15rem';
});
