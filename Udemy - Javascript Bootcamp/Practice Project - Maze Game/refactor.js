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

//restart game
document.querySelector('#restart').addEventListener('click', ()=>{
    mazeRows = 3;
    mazeColumns = 3;
    reset();
});

//play next level
document.querySelector('#next').addEventListener('click', () =>{
    if(mazeColumns <= mazeRows * 2){
        mazeColumns++;
    } else {
        mazeRows++;
        mazeColumns = mazeRows;
    }
    reset();
});

