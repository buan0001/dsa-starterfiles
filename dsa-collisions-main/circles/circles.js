"use strict";
window.addEventListener("load", start);

function start() {
  console.log("JavaScript is running");
  document.addEventListener("keydown", keyEvent);
  document.addEventListener("keyup", keyEvent);

  document.querySelector("#show-geometry").addEventListener("change", changeShowGeometry);

  registerValueChanges();

  requestAnimationFrame(tick);
}

function keyEvent(event) {
  const control = controlMap[event.code];
  const value = event.type === "keydown";

  if (control) {
    controls[control] = value;
  }
}

// The control map, maps keycodes to control-directions
const controlMap = {
  ArrowRight: "right",
  KeyD: "right", // you can have multiple keys with the same controls
  ArrowLeft: "left",
  KeyA: "left",
  ArrowUp: "up",
  KeyW: "up",
  ArrowDown: "down",
  KeyS: "down",
  Space: "fire", // But this doesn't work: you can't have
  Space: "jump", // multiple controls for the same key!
};

// the controls contain the directions currently "active"
const controls = {
  up: false,
  down: false,
  left: false,
  right: false,
  fire: false,
  jump: false,
};

/* CONTROLLER */

function tick() {
  // ignore the deltaTime and accurate frame calculation - just move 1 pixel each frame
  requestAnimationFrame(tick);

  // move
  movePlayer();

  // check collisions
  if (isColliding(player, object)) {
    player.collision = true;
    object.collision = true;
  } else {
    player.collision = false;
    object.collision = false;
  }

  // update display
  displayPlayer();
  displayObject();

  // - update info
  displayPlayerInfo();
  displayObjectInfo();
  displayCollisionInfo();

  // - update geometry
  if (showGeometry) {
    displayGeometry();
  }
}

function movePlayer() {
  if (controls.left) {
    player.x--;
  } else if (controls.right) {
    player.x++;
  }

  if (controls.up) {
    player.y--;
  } else if (controls.down) {
    player.y++;
  }
}

/* MODEL */

let showGeometry = true;

const player = {
  x: 0,
  y: 0,
  r: 32,
};

const object = {
  x: 300,
  y: 200,
  r: 90,
};


function isColliding(circleA, circleB) {
  // Circles know: r, x and y
  const distance = Math.hypot(circleA.x - circleB.x, circleA.y - circleB.y); // TODO: Make calculation (use Pythagoras)
  
  const combinedSize = circleA.r + circleB.r;
  // if distance is less than combined size - we have a collision!
  return distance < combinedSize;
}

/* VIEW */

function displayPlayer() {
  const visualPlayer = document.querySelector("#player");

  visualPlayer.style.setProperty("--x", player.x);
  visualPlayer.style.setProperty("--y", player.y);
  visualPlayer.style.width = 2 * player.r + "px";
}

function displayObject() {
  const visualObject = document.querySelector("#object");

  visualObject.style.setProperty("--x", object.x);
  visualObject.style.setProperty("--y", object.y);
  visualObject.style.width = 2 * object.r + "px";
  if (object.collision) {
    visualObject.classList.add("collision");
  } else {
    visualObject.classList.remove("collision");
  }
}

/* INFO section */

function displayPlayerInfo() {
  document.querySelector("#player-x").value = player.x;
  document.querySelector("#player-y").value = player.y;
  document.querySelector("#player-r").value = player.r;
}

function displayObjectInfo() {
  document.querySelector("#object-x").value = object.x;
  document.querySelector("#object-y").value = object.y;
  document.querySelector("#object-r").value = object.r;
}

function displayCollisionInfo() {
  const collisionInfo = document.querySelector("#collision-status");
  if (player.collision) {
    collisionInfo.textContent = "Collision!!";
    collisionInfo.classList.add("collision");
  } else {
    collisionInfo.textContent = "No collision ...";
    collisionInfo.classList.remove("collision");
  }
}

function registerValueChanges() {
  document.querySelectorAll("#info input").forEach((input) => {
    input.addEventListener("input", (event) => {
      const id = event.target.id;
      // find the object to manipulate
      const objectName = event.target.id.split("-")[0];
      // and the property
      const propertyName = event.target.id.split("-")[1];
      // and the value
      const value = Number(event.target.value);
      // set the value
      switch (objectName) {
        case "player":
          player[propertyName] = value;
          break;
        case "object":
          object[propertyName] = value;
          break;
      }
    });
  });
}

/* GEOMETRY info section */

function changeShowGeometry(event) {
  showGeometry = event.target.checked;
  document.querySelector("#geometry").classList.toggle("hidden", !showGeometry);
}

function displayGeometry() {
  const distanceLine = document.querySelector("svg#geometry #distance");
  const deltaXLine = document.querySelector("svg#geometry #deltaX");
  const deltaYLine = document.querySelector("svg#geometry #deltaY");
  const tinyRect = document.querySelector("svg#geometry #tinyRect");

  function setXY1(element, pos) {
    element.x1.baseVal.value = pos.x;
    element.y1.baseVal.value = pos.y;
  }

  function setXY2(element, pos) {
    element.x2.baseVal.value = pos.x;
    element.y2.baseVal.value = pos.y;
  }

  // line from player to object
  setXY1(distanceLine, player);
  setXY2(distanceLine, object);

  // horisontal line from player to "meeting-spot"
  setXY1(deltaXLine, player);
  setXY2(deltaXLine, { x: object.x, y: player.y });

  // vertical line from object to "meeting-spot"
  setXY1(deltaYLine, object);
  setXY2(deltaYLine, { x: object.x, y: player.y });

  // tiny rectangle to indicate the "right triangle"
  tinyRect.x.baseVal.value = object.x - (player.x < object.x ? 10 : 0);
  tinyRect.y.baseVal.value = player.y - (player.y > object.y ? 10 : 0);
}
