//----- GAME LOOP --------------------------------------------------------------------------------------------------------------------------
//maze config
const mazeWidth = document.documentElement.clientWidth;
const mazeHeight = document.documentElement.clientHeight;
let mazeRows = 3;
let mazeColumns = 3;

//start the game
let maze = gameStart(mazeWidth, mazeHeight, mazeRows, mazeColumns);

//play again
document.querySelector('#restart').addEventListener('click', reset);

//change
document.querySelector('#next').addEventListener('click', () =>{
    if(mazeRows === mazeColumns){
        mazeColumns++;
    } else {
        mazeRows++;
    }
    reset();
});

