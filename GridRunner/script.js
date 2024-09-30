"use strict";

window.addEventListener("load", start);

// ****** CONTROLLER ******
// #region controller

function start() {
  console.log(`Javascript kører`);

  document.addEventListener("keydown", keyPressed);
  // start ticking
  tick();
}

let direction = "a";

function tick() {
  // setup next tick
  setTimeout(tick, 200);

  switch (direction) {
    case "arrowleft":
    case "a":
      moveLeft();
      break;
    case "arrowright":
    case "d":
      moveRight();
      break;
    case "arrowup":
    case "w":
      moveUp();
      break;
    case "arrowdown":
    case "s":
      moveDown();
      break;
  }

  writeToCell(player.row, player.col, 1);

  // display the model in full
  displayBoard();
}

function moveUp() {
  writeToCell(player.row--, player.col, 0);
  if (player.row < 0) {
    player.row = 9;
  }
}

function moveDown() {
  writeToCell(player.row++, player.col, 0);
  if (player.row > 9) {
    player.row = 0;
  }
}

function moveLeft() {
  writeToCell(player.row, player.col--, 0);
  if (player.col < 0) {
    player.col = 9;
  }
}

function moveRight() {
  writeToCell(player.row, player.col++, 0);
  if (player.col > 9) {
    player.col = 0;
  }
}

// #endregion controller

// ****** MODEL ******
// #region model
const model = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const player = { row: 5, col: 5 };

function writeToCell(row, col, value) {
  model[row][col] = value;
}

function readFromCell(row, col) {
  return model[row][col];
}

// #endregion model

// ****** VIEW ******
// #region view

function displayBoard() {
  const cells = document.querySelectorAll("#grid .cell");
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const index = row * 10 + col;

      switch (readFromCell(row, col)) {
        case 0:
          cells[index].classList.remove("player", "goal");
          break;
        case 1: // Note: doesn't remove goal if previously set
          cells[index].classList.add("player");
          cells[index].classList.remove("goal");
          break;
        case 2: // Note: doesn't remove player if previously set
          cells[index].classList.add("goal");
          cells[index].classList.remove("player");
          break;
      }
    }
  }
}

function keyPressed(event) {
  console.log("key pressed:",event);
  const key = event.key.toLowerCase();
  console.log(key);
  
  const validInput = ["arrowup", "arrowdown","arrowleft","arrowright", "w", "a","s","d"]
  if (validInput.some(validKey => validKey == key)) {
    direction = key;
  }
}

// #endregion view
