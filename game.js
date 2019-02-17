// Create the canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

//Create reset button
const resetBtn = document.createElement('button');
const txtbutton = document.createTextNode("RESET GAME");
resetBtn.appendChild(txtbutton);
document.body.appendChild(resetBtn);

//Sound constructor
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

// Background image
let bgReady = false;
const bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = 'images/background.png';

// Hero Image
let heroReady = false;
const heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = 'images/hero.png';

// Monster Image
let monsterReady = false;
const monsterImage = new Image();
monsterImage.onload = function () {
  monsterReady = true;
};
monsterImage.src = 'images/monster.png';

// Game Objects
const hero = {
  speed: 256 // movement in pixels per second
};
const monster = {};
let monstersCaught = 0;

// Keyboard Controls
const keysDown = {};

window.addEventListener('keydown', function (e) {
  keysDown[e.keyCode] = true;
}, false);

window.addEventListener('keyup', function (e) {
  delete keysDown[e.keyCode];
}, false);

// Reset the game when the Hero catches the Monster
const reset = function () {
  hero.x = canvas.width / 2;
  hero.y = canvas.height / 2;

  // Position the Monsterr randomicaly on the screen
  monster.x = 32 + (Math.random() * (canvas.width - 64));
  monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update the Game Status
const update = function (modifier) {
  if (38 in keysDown) { // Pressing arrow up
    if (hero.y <= 0) { //so the hero doesn't extrapolate the canvas at the top side
      hero.y = 0;
    }
    else {
      hero.y -= hero.speed * modifier;
    } 
  }
  if (40 in keysDown) { // Pressing arrow down
    if (hero.y >= (canvas.height - 32)) { //so the hero doesn't extrapolate the canvas at the bottom side
      hero.y = canvas.height - 32;
    }
    else {
    hero.y += hero.speed * modifier;
    }
  }
  if (37 in keysDown) { // Pressing arrow left
    if (hero.x <= 0) { //so the hero doesn't extrapolate the canvas at the left side
      hero.x = 0;
    }
    else {
    hero.x -= hero.speed * modifier;
    }
  }
  if (39 in keysDown) { // Pressing arrow right
    if (hero.x >= (canvas.width - 32)) { //so the hero doesn't extrapolate the canvas at the right side
      hero.x = canvas.width -32;
    }
    else {
    hero.x += hero.speed * modifier;
    }
  }

  // Check if the characters touched each other 
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
	catchSoundFx.play();
    reset();
  }
};


//Defining the Game Loop

var count; // how many seconds the game lasts
var finished; //boolean to set if the game is over
var highScore = 0; //high score for the session

//Start Game
const startGame = function(){
	finished = false;
	 // how many seconds the game lasts
	count = 30;
    //show monster and hero
    monsterReady = true;
    heroReady = true;
    //reset monster caught
    monstersCaught = 0;
    //hide reset button
    resetBtn.style.display = "none";
    //Sound Effects
    //backgroundMusic = new sound("sounds/bgmusic.mp3");
    catchSoundFx = new sound("sounds/catch.wav");
    gameOverSoundFx = new sound("sounds/timeUp.wav");
};


//Setting Game Over when time limit is reached
const gameOver = function(){
	// stop the timer
    clearInterval(counter);
    //set game to finished
    finished = true;
    count = 0;
    //game over sound
    gameOverSoundFx.play();
    //hide monster and hero
    monsterReady=false;
    heroReady=false;
    //show reset button
    resetBtn.style.display = "block";
    //set high score
    if(monstersCaught > highScore){
    	highScore = monstersCaught;
    }
};

//Setting the game loop with a time limit
var counter = function(){
  count--; // countown by 1 every second
  // when count reaches 0 clear the timer, finish the game
  if (count <= 0)
  {
    gameOver();
  }
}

// timer interval is every second (1000ms)
setInterval(counter, 1000);

// Render
const render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0);
  }

  if (heroReady) {
    ctx.drawImage(heroImage, hero.x, hero.y);
  }

  if (monsterReady) {
    ctx.drawImage(monsterImage, monster.x, monster.y);
  }

  //UI Style
  ctx.fillStyle = 'rgb(230, 230, 230)';
  ctx.font = '20px Helvetica';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  //Display Score
  ctx.fillText('Monsters caught: ' + monstersCaught, 32, 32);
  //Display High Score
  if (highScore > 0) {
  	ctx.fillText('High Score: ' + highScore, 300, 32);
  }
  //Display Time
  ctx.fillText("Time: " + count, 32, 56);
  // Display game over message when timer finished
  if(finished==true){
    ctx.fillText("Game over!", 200, 220);
    document.body.appendChild(canvas);
  }
};

// Controls the Game loop
const main = function () {
  const now = Date.now(); 
  const delta = now - then;
  update(delta / 1000);
  render();

  then = now;

  // Execute this ASAP
  requestAnimationFrame(main);
};

// Cross-browser support for requestAnimationFrame
const w = window;
const requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Game On!
let then = Date.now();
reset();
startGame();
main();

resetBtn.onclick = function(){
	startGame();
};