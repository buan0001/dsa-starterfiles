"use strict";

// Some dummy-code to test that the view can be viewed ...

window.addEventListener("load", start);

function start() {
  displayEntireChain(dummyModel);
  displayCannonBall(cannonBall);
}

// ***** A dummy standin for the actual model *****
//  remember to replace with real model, once that has been designed   
const dummyModel = ["🔴", "🔵","🟡","🟡","🔵","🟢","🟢"];
let cannonBall = "🟡";
  
// *********************************
// *                               *
// *          THE VIEW             *
// *                               *
// *********************************

const visualBalls = {
  "🔴": "red-ball.png",
  "🔵": "blue-ball.png",
  "🟡": "yellow-ball.png",
  "🟢": "green-ball.png"
}

function displayEntireChain(model) {
  const visualChain = document.querySelector("#chain");
  // remove everything
  visualChain.innerHTML = "";

  // iterate through model of balls <- there might be a different way of doing this!
  for(const ball of model) {
    // add ball
    const visualBall = createVisualBall(ball);
    visualChain.append(visualBall);
    // add button to click on ball
    addButtonTo(visualBall);
  }
}

function displayCannonBall(ball) {
  const visualCannon = document.querySelector("#cannon");
  visualCannon.innerHTML = "";
  const visualCannonBall = createVisualBall(ball);
  visualCannon.append(visualCannonBall);
}

function createVisualBall(ball) {
  const visualBall = document.createElement("div");
  visualBall.classList.add("ball");
  const image = document.createElement("img");
  image.src = "images/"+visualBalls[ball];
  visualBall.append(image);
  return visualBall;
}

function createButton() {
  const button = document.createElement("button");
  button.textContent = "↑";
  return button;
}

function addButtonTo(visualBall) {
  const button = createButton();
  visualBall.append(button);
  // handle click
  button.addEventListener("click", () => {
    // Find the position of this visual ball in the view (the index)
    const index = Array.from(document.querySelectorAll("#chain .ball")).indexOf(visualBall);
    // NOTE: I'm absolutely sure there is a better way!
    
    // notify that we want to insert a ball AFTER this (index)
    console.log("Insert new ball after index: " + index);
    // TODO: Notify controller that we want to insert a new ball here

  });
}

function insertNewBallAfter( index, newBall ) {
  // find the ball at this index (and the button right after)
  const lastVisualBall = document.querySelectorAll("#chain .ball")[index];
  const newVisualBall = createVisualBall(newBall);

  lastVisualBall.after(newVisualBall);

  // add button to ball
  const button = createButton();
  newVisualBall.append(button);

  return newVisualBall;
} 

function removeVisualBall( visualBall ) {
  visualBall.remove();
}
// Animations

/**
 * Use simple animation to expand the space already occupied by a visualball 
 */
function animateExpandSpaceForBall( visualBall ) {
  visualBall.classList.add("expand");
  visualBall.addEventListener("animationend", doneExpanding);

  function doneExpanding() {
    visualBall.removeEventListener("animationend", doneExpanding);
    visualBall.classList.remove("expand");
  }
}

/**
 * Use FLIP animation to animate a ball from the position of the canonball
 */
function animateFromCanonBallToFinalPosition( visualBall ) {
  // First: Find the starting position of the ball - which is where the cannonball is
  const source = document.querySelector("#cannon .ball img").getBoundingClientRect();

  // Last: Find the destination position of the ball - which is where it has been added
  const image = visualBall.querySelector("img");
  const destination = image.getBoundingClientRect();

  // Invert: calculate the distance to move from source to destination
  const deltaX = source.x - destination.x;
  const deltaY = source.y - destination.y;

  // Play: run the animation from source to destination
  image.style.setProperty("--delta-x", deltaX + "px");
  image.style.setProperty("--delta-y", deltaY + "px");
  image.classList.add("animatefromcannon");

  // Hide the cannonball while animating
  document.querySelector("#cannon .ball img").classList.add("hide");

  image.addEventListener("animationend", doneMoving);

  function doneMoving() {
    image.removeEventListener("animationend", doneMoving);
    image.classList.remove("animatefromcannon");
    image.style.removeProperty("--delta-x");
    image.style.removeProperty("--delta-y");

    document.querySelector("#cannon .ball img").classList.remove("hide");
    // TODO: Notify controller when ball has moved
  }
}


function animateBallToDisappear( visualBall ) {
  visualBall.classList.add("implode");
  visualBall.addEventListener("animationend", doneDisappearing);

  function doneDisappearing() {
    visualBall.classList.remove("implode");
    visualBall.removeEventListener("animationend", doneDisappearing);
    // TODO: Notify controller when ball is gone
  }
}
