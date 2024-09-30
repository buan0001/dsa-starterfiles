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
// const head = { row: 5, col: 5 };
const queue = [
  { row: 5, col: 5 },
  // { row: 5, col: 6 },
  // { row: 5, col: 7 },
];

function tick() {
  // setup next tick
  setTimeout(tick, 600);

  for (const part of queue) {
    writeToCell(part.row, part.col, 0);
  }

  const oldHead = {
    row: queue[queue.length - 1].row,
    col: queue[queue.length - 1].col,
  };

  switch (direction) {
    case "arrowleft":
    case "a":
      moveLeft(oldHead);
      break;
    case "arrowright":
    case "d":
      moveRight(oldHead);
      break;
    case "arrowup":
    case "w":
      moveUp(oldHead);
      break;
    case "arrowdown":
    case "s":
      moveDown(oldHead);
      break;
  }

  if (queue.length >= 3) {
    queue.shift();
    // writeToCell(deleted.row, deleted.col, 0);
    queue.push(oldHead);
    // queue.push({ ...oldHead });
  } else if (queue.length < 3) {
    queue.push({ ...oldHead });
  }
  for (const tile of queue) {
    writeToCell(tile.row, tile.col, 1);
  }
  // console.log("queue:", queue);
  // console.log("length", queue.length);

  // display the model in full
  displayBoard();
}

function moveUp(head) {
  writeToCell(head.row--, head.col, 0);
  if (head.row < 0) {
    head.row = 9;
  }
}

function moveDown(head) {
  writeToCell(head.row++, head.col, 0);
  if (head.row > 9) {
    head.row = 0;
  }
}

function moveLeft(head) {
  writeToCell(head.row, head.col--, 0);
  if (head.col < 0) {
    head.col = 9;
  }
}

function moveRight(head) {
  writeToCell(head.row, head.col++, 0);
  if (head.col > 9) {
    head.col = 0;
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
  // console.log("key pressed:",event);
  const key = event.key.toLowerCase();
  // console.log(key);

  const validInput = ["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d"];
  if (validInput.some(validKey => validKey == key)) {
    direction = key;
  }
}

// #endregion view
