//----- GAME LOOP --------------------------------------------------------------------------------------------------------------------------
//maze config
const mazeWidth = document.documentElement.clientWidth;
const mazeHeight = document.documentElement.clientHeight;
const mazeRows = 3;
const mazeColumns = 3;

//start the game
let maze = gameStart(mazeWidth, mazeHeight, mazeRows, mazeColumns);

//play again
document.querySelector('#restart').addEventListener('click', reset);