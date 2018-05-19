// Create the canvas
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

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
  if (38 in keysDown) { // Pressing up arrow
    hero.y -= hero.speed * modifier;
  }
  if (40 in keysDown) { // Pressing down arrow
    hero.y += hero.speed * modifier;
  }
  if (37 in keysDown) { // Pressing left arrow
    hero.x -= hero.speed * modifier;
  }
  if (39 in keysDown) { // Pressing right arrow
    hero.x += hero.speed * modifier;
  }

  // Check if the characters touched each other
  if (
    hero.x <= (monster.x + 32)
    && monster.x <= (hero.x + 32)
    && hero.y <= (monster.y + 32)
    && monster.y <= (hero.y + 32)
  ) {
    ++monstersCaught;
    reset();
  }
};

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

  // Score
  ctx.fillStyle = 'rgb(250, 250, 250)';
  ctx.font = '24px Helvetica';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText('Pessoas salvas: ' + monstersCaught, 32, 32);
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
main();