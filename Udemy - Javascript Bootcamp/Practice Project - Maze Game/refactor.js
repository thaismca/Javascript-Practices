//----- GAME LOOP --------------------------------------------------------------------------------------------------------------------------
//maze config
const mazeWidth = window.innerWidth;
const mazeHeight = window.innerHeight;
let mazeRows = 3;
let mazeColumns = 3;
//level complete root element
levelCompleteRoot = document.querySelector('.level-complete');

//start the game
let maze = gameStart(mazeWidth, mazeHeight, mazeRows, mazeColumns, levelCompleteRoot);

