"use strict";
window.addEventListener("load", start);

function start() {
  console.log("Javascript is running");
  document.addEventListener("keydown", keyEvent);
  document.addEventListener("keyup", keyEvent);

  document.querySelector("#show-geometry").addEventListener("change", changeShowGeometry);
  document.querySelector("#geometry-settings").addEventListener("change", changeShowGeometryDetail);
  
  registerValueChanges();
  registerColorChanges();
  
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
  w: 55,
  h: 70,
};

const object = {
  x: 250,
  y: 100,
  w: 190,
  h: 90,
};

function isColliding(rectA, rectB) {
  // determine if the two rectangles are colliding, i.e. overlapping
  // e.g. by using the AABB (Axis-Aligned Bounding Box) method
  
  // Check if the bottom of rectA is lower than the top of rectB
  const belowTop = false; // TODO: Make comparison and set value to true or false

  // Check if the top of rectA is higher than the bottom of rectB
  const aboveBottom = false; // TODO: Make comparison and set value to true or false

  // Check if the right side of rectA is to the right of the left side of rectB
  const afterLeft = false; // TODO: Make comparison and set value to true or false

  // Check if the left side of rectA is to the left of the right side of rectB
  const beforeRight = false; // TODO: Make comparison and set value to true or false
  
  // Only if all four conditions are met, the rectangles are colliding
  return belowTop && aboveBottom && afterLeft && beforeRight;
}

/* VIEW */

function displayPlayer() {
  const visualPlayer = document.querySelector("#player");

  visualPlayer.style.setProperty("--x", player.x);
  visualPlayer.style.setProperty("--y", player.y);
  visualPlayer.style.setProperty("--w", player.w);
  visualPlayer.style.setProperty("--h", player.h);
}

function displayObject() {
  const visualObject = document.querySelector("#object");

  visualObject.style.setProperty("--x", object.x);
  visualObject.style.setProperty("--y", object.y);
  visualObject.style.setProperty("--w", object.w);
  visualObject.style.setProperty("--h", object.h);
}

/* INFO section */

function displayPlayerInfo() {
  document.querySelector("#player-x").value = player.x;
  document.querySelector("#player-y").value = player.y;
  document.querySelector("#player-w").value = player.w;
  document.querySelector("#player-h").value = player.h;
}

function displayObjectInfo() {
  document.querySelector("#object-x").value = object.x;
  document.querySelector("#object-y").value = object.y;
  document.querySelector("#object-w").value = object.w;
  document.querySelector("#object-h").value = object.h;
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
  document.querySelector("fieldset.geometry").disabled = !showGeometry;
}

function changeShowGeometryDetail(event) {
  // make sure we only react to checkbox changes
  if(event.target.type !== "checkbox") {
    return;
  }

  const detail = event.target.id.split("-")[1];
  const value = event.target.checked;
  
  if(detail === "lines") {
    document.querySelectorAll("#geometry g.lines").forEach((line) => {
      line.classList.toggle("hidden", !value);
    });
  }
  if(detail === "overlaps") {
    document.querySelectorAll("#geometry g.overlaps").forEach((line) => {
      line.classList.toggle("hidden", !value);
    });
    document.querySelector("fieldset.overlaps").disabled = !value;
  }
  if(["left", "right", "top", "bottom"].includes(detail)) {
    document.querySelector(`#geometry g.overlaps #overlapObject${detail.charAt(0).toUpperCase() + detail.slice(1)}`).classList.toggle("hidden", !value);
  }
}

function registerColorChanges() {
  document.querySelectorAll("input[type=color]").forEach((input) => {
    input.addEventListener("input", (event) => {
      const name = event.target.id.split("-")[1];
      const value = event.target.value;
      const patternId = `diagonal${name.charAt(0).toUpperCase() + name.slice(1)}`;
      document.querySelector(`#${patternId} line`).style.stroke=value;   
    });
  });
}

function displayGeometry() {
  const height = document.querySelector("#geometry").clientHeight;
  const width = document.querySelector("#geometry").clientWidth;

  const objectLeft = document.querySelector("svg#geometry #objectLeft");
  const objectRight = document.querySelector("svg#geometry #objectRight");
  const objectTop = document.querySelector("svg#geometry #objectTop");
  const objectBottom = document.querySelector("svg#geometry #objectBottom");

  const playerLeft = document.querySelector("svg#geometry #playerLeft");
  const playerRight = document.querySelector("svg#geometry #playerRight");
  const playerTop = document.querySelector("svg#geometry #playerTop");
  const playerBottom = document.querySelector("svg#geometry #playerBottom");

  const overlapObjectTop = document.querySelector("svg#geometry #overlapObjectTop");
  const overlapObjectBottom = document.querySelector("svg#geometry #overlapObjectBottom");
  const overlapObjectLeft = document.querySelector("svg#geometry #overlapObjectLeft");
  const overlapObjectRight = document.querySelector("svg#geometry #overlapObjectRight");

  function setLineX(line, position) {
    line.x1.baseVal.value = position;
    line.x2.baseVal.value = position;
    line.y1.baseVal.value = 0;
    line.y2.baseVal.value = height;
  }

  function setLineY(line, position) {
    line.y1.baseVal.value = position;
    line.y2.baseVal.value = position;
    line.x1.baseVal.value = 0;
    line.x2.baseVal.value = width;
  }

  function setRectX(rectangle, x, w) {
    rectangle.y.baseVal.value = 0;
    rectangle.height.baseVal.value = height;
    rectangle.x.baseVal.value = x;
    rectangle.width.baseVal.value = w;
  }

  function setRectY(rectangle, y, h) {
    rectangle.x.baseVal.value = 0;
    rectangle.width.baseVal.value = width;
    rectangle.y.baseVal.value = y;
    rectangle.height.baseVal.value = h;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // lines demarking the object
  setLineX(objectLeft, object.x);
  setLineX(objectRight, object.x + object.w);
  setLineY(objectTop, object.y);
  setLineY(objectBottom, object.y + object.h);

  // lines demarking the player
  setLineX(playerLeft, player.x);
  setLineX(playerRight, player.x + player.w);
  setLineY(playerTop, player.y);
  setLineY(playerBottom, player.y + player.h);

  // show rectangles for overlapping areas
  setRectY(overlapObjectTop, object.y, clamp(player.y + player.h - object.y, 0, object.h));
  setRectY(overlapObjectBottom, clamp(player.y, object.y, object.y + object.h), clamp(object.y + object.h - player.y, 0, object.h));
  setRectX(overlapObjectLeft, object.x, clamp(player.x - object.x + player.w, 0, object.w));
  setRectX(overlapObjectRight, clamp(player.x, object.x, object.x + object.w), clamp(object.x + object.w - player.x, 0, object.w));
}