//-----MATTER JS RENDERER AND RUNNER-----------------------------------------------------------------------------------------------------
//getting access to some objects out of the Matter JS library 
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
//create a new engine
const engine = Engine.create();
//get access to a world that got created along with that engine
//a world is kind of like a snapshot of all the differents shapes that we have
const { world } = engine;
//create a render passing in and object cointaing further information
 const render = Render.create({
    //where the representation of everything should be rendered inside of the HTML document
    element: document.body, //additive process, so no existing content in the body will be destroyed
    //inform which engine should be used
    engine: engine,
    options: {
        //specify the height and width of the canvas element that is going to be used to display all that's rendered
        width: document.documentElement.clientWidth,
        height:document.documentElement.clientHeight,
        wireframes: false
    }
 });
 //tell the render object to start working and draw all the updates of world onto the screen
Render.run(render);
//runner to coordinate all the changes from state A to state B of the engine
Runner.run(Runner.create(), engine);

//----- MAZE BUILDER --------------------------------------------------------------------------------------------------------------------
class Maze {
    constructor(width, height, gridRows, gridColums){
        this.width = width;
        this.height = height;
        this.gridRows = gridRows;
        this.gridColumns = gridColums;

        this.calcProperties();
    }

    calcProperties(){
        this.unitWidth = this.width/this.gridColumns;
        this.unitHeight = this.height/this.gridRows;
        //grid -> 2d array that tracks all the actual existing cells to record whether each one of them was already visited or not
        this.grid = Array(this.gridRows).fill(null).map(()=> Array(this.gridColumns).fill(false));
        //verticals -> 2d array that tracks the walls between two different cells that are right next to each other on the same row
        this.verticals = Array(this.gridRows).fill(null).map(() => Array(this.gridColumns-1).fill(false));
        //horizontals -> 2d array that tracks walls between two different cells that are right next to each other on the same column
        this.horizontals = Array(this.gridRows-1).fill(null).map(() => Array(this.gridColumns).fill(false));
        this.goal = Bodies.rectangle(
            //position -> middle of the cell in the bottom-right corner
            this.width - (this.unitWidth/2), //x position
            this.height - (this.unitHeight/2),  //y position
            //size -> scale with the unit size (60% of the unit size)
            this.unitWidth * 0.6, //goal width
            this.unitHeight * 0.6, //goal height
            { 
            //customize label (to make it easier to write function that detects collision)
            label: 'goal',
            //static shape
            isStatic: true,
            render: {fillStyle: 'LimeGreen'}
            }
        );
        this.player = Bodies.circle(
            //position -> middle of the cell in the top-left corner
            this.unitWidth/2, //x position
            this.unitHeight/2,  //y position
            //size -> scale with the unit size (50% of the unit width or height, whichever is the smallest)
            (Math.min(this.unitWidth, this.unitHeight) * 0.5)/2, //player radius
            { 
                //customize label (to make it easier to write function that detects collision)
                label: 'player',
                //frictionAir: makes body slow down when moving through space
                frictionAir: 0.05,
                render: {fillStyle: 'Khaki'}
            }    
        );
    }

    //a recursive function that updates verticals and horizontals generating info that can be used to create a valid maze
    stepThroughCell(row, column){
        //if the cell was already visited, then return (do nothing)
        if(this.grid[row][column] === true){
            return;
        }
    
        //mark this cell as being visited (update grid array)
        this.grid[row][column] = true;
        //assemble randomly-ordered list of neighbors using the shuffle helper function
        const neighbors = this.shuffle([
            [row - 1, column, 'up'], //above
            [row + 1, column, 'down'], //below
            [row, column - 1, 'left'], //left
            [row, column + 1, 'right'] //right
        ]);

        //for each neighbor
        for(let neighbor of neighbors) {
            //deconstruct from neighbor variables that represent the row and column of the next cell that can be visited next
            const [nextRow, nextColumn, direction] = neighbor;
            //see if neighbor is out of bounds
            if(nextRow < 0 || nextRow >= this.gridRows || nextColumn < 0 || nextColumn >= this.gridColumns){
                //don't do anything else for this current iteration -> move on to the next neighbor of neighbors
                continue;
            }
            //if the neighbor was already visited, continue to next neighbor
            if(this.grid[nextRow][nextColumn] === true){
                continue;
            }
            //remove a wall from either horizontals or verticals, depending on the direction we are moving
            //up or down -> update horizontals | left or right -> update verticals
            //to update the walls in either direction, consider the position from the starting cell (row, column)
            //column doesn't change when moving up/down, and row doesn't change when moving left/right
            if(direction === 'up'){
                this.horizontals[row-1][column] = true;
            } else if(direction === 'down'){
                this.horizontals[row][column] = true;
            } else if(direction === 'left'){
                this.verticals[row][column-1] = true;
            } else if(direction === 'right'){
                this.verticals[row][column] = true;
            }

            //call stepThroughCell passing this neighbor nextRow and nextColumn
            this.stepThroughCell(nextRow, nextColumn);
        }
    }

    //helper function that shuffles elements in an array and returns this shuffled array
    shuffle(arr){
        //get the length of the array
        let counter = arr.length;
        //iterate over the array starting from the last element until it reaches the first one
        while(counter > 0) {
            //get a random index inside the array
            const index = Math.floor(Math.random() * counter);
            //decrease counter by 1
            counter --;
            //swap elements at the indices represented by the values of index and counter
            const temp = arr[index];
            arr[index] = arr[counter];
            arr[counter] = temp;
        }
        //return shuffled array
        return arr;
    };

    drawMaze(){
        //creating walls
        const walls =[
            //for each wall, create a new shape, passing the shape's position and size
            //note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)
            Bodies.rectangle((this.width/2), 0, this.width, 3, {label: 'wall', isStatic: true}), //top wall
            Bodies.rectangle(0, (this.height/2), 3, this.height, {label: 'wall', isStatic: true}), //left wall
            Bodies.rectangle((this.width/2), this.height, this.width, 3, {label: 'wall', isStatic: true}), //bottom wall
            Bodies.rectangle(this.width, (this.height/2), 3, this.height, {label: 'wall', isStatic: true}), //right wall
        ]
        //add the shape to the world -> shape won't appear in world without this
        World.add(world, walls);

        //iterate over horizontals to draw horizontal walls based on the data in horizontals
        this.horizontals.forEach((row, rowIndex) => {
            row.forEach((segment, columnIndex) => {
                if(segment === true) { //no wall
                    return;
                }
                //create a rectangle that will represent the wall
                const xPos = (columnIndex * this.unitWidth) + (this.unitWidth/2);
                const yPos = (rowIndex * this.unitHeight) + this.unitHeight;
                const wall = Bodies.rectangle(xPos, yPos, this.unitWidth, 10, {isStatic: true, render: {fillStyle: 'gray'}});
        
                //add the wall to the world -> shape won't appear in world without this
                World.add(world, wall);
            });
        });

        //iterate over verticals to draw vertical walls based on the data in verticals
        this.verticals.forEach((row, rowIndex) => {
            row.forEach((segment, columnIndex) => {
                if(segment === true) { //no wall
                    return;
                }
                //create a rectangle that will represent the wall
                const xPos = (columnIndex + 1) * this.unitWidth;
                const yPos = (rowIndex * this.unitHeight) + (this.unitHeight/2);
                const wall = Bodies.rectangle(xPos, yPos, 10, this.unitHeight, {isStatic: true, render: {fillStyle: 'gray'}});

                //add the wall to the world -> shape won't appear in world without this
                World.add(world, wall);
            });
        });

        //add the goal to the world -> shape won't appear in world without this
        World.add(world, this.goal);
        //add the goal to the world -> shape won't appear in world without this
        World.add(world, this.player);
    };
};

//----- GAME FUNCTIONS ----------------------------------------------------------------------------------------------------------------------
//level tracker
const level = {
    levelRows: 0,
    levelColumns: 0
}

//function that creates a game 
function gameStart(mazeWidth, mazeHeight, mazeRows, mazeColumns, levelCompleteElement){
    //disable gravity in the y axis
    world.gravity.y = 0;
    //generate the two random numbers that will represents the position of the cell that will be selected to start the maze generation from 
    const startRow = Math.floor(Math.random() * mazeRows);
    const startColumn = Math.floor(Math.random() * mazeColumns);

    //generate maze using maze config
    const maze = new Maze(mazeWidth, mazeHeight, mazeRows, mazeColumns);
    maze.stepThroughCell(startRow, startColumn);
    engine.world.gravity.y = 0; //disables gravity in the y axis
    maze.drawMaze();

    //level tracker update
    level.levelRows = mazeRows;
    level.levelColumns = mazeColumns;

    //generate level complete screen if the levelCompleteElement is passed
    if(levelCompleteElement) {
        createLevelCompleteScreen(levelCompleteElement);
    }
    
    return maze;
};

function createLevelCompleteScreen(element){
    element.innerHTML = `
    <div class="level-win hidden">
      <h1>YOU WIN!</h1>
      <button id="restart">restart game</button>
      <button id="next">next level</button>
    </div>
    `

    //restart game
    document.querySelector('#restart').addEventListener('click', () => {
        reset(mazeRows, mazeColumns);
    });

    //play next level
    document.querySelector('#next').addEventListener('click', () =>{
        let { levelRows, levelColumns } = level
        if(levelColumns <= levelRows * 2){
            levelColumns++;
        } else {
            levelRows++;
            levelColumns = levelRows;
        }
        reset(levelRows, levelColumns);
    })
};

function levelComplete(bodyA, bodyB,){
    //enable gravity to run animation
    world.gravity.y = 1;
    //change labels from player and goal so the collision is no longer tracked
    bodyA.label = '';
    bodyB.label = '';
    //setStatic to false for all bodies except the walls and the player
    world.bodies.forEach((body) => {
        if(body.label !== 'wall' && body.label !== 'player'){
            Body.setStatic(body, false);
        }
    });

    //display win message and restart button
    document.querySelector('.level-win').classList.remove('hidden');
};

//a function to reset the maze at a given level
function reset(levelRows, levelColumns){
    //remove all bodies from the world.bodies array
    world.bodies.splice(0, world.bodies.length);
    //hide win message and restart button
    document.querySelector('.level-win').classList.add('hidden');
    //start a new game
    maze = gameStart(mazeWidth, mazeHeight, levelRows, levelColumns);
};

//player key controls
document.addEventListener('keydown', e => {
    //a reference to the player's current velocity
    const {x, y} = maze.player.velocity;
    //a limit to the speed that the ball can reach, to prevent it from moving too fast
    const speedLimit = 4;
    if(e.code === 'ArrowDown' || e.code === 'KeyS'){
        //move player down -> add velocity in the down direction by adding to current y
        Body.setVelocity(maze.player, { x, y: Math.min(y+2, speedLimit) });
    } else if(e.code === 'ArrowUp' || e.code === 'KeyW'){
        //move player up -> add velocity in the up direction by subtracting from current y
        Body.setVelocity(maze.player, { x, y: Math.max(y-2, -speedLimit) });
    } else if(e.code === 'ArrowLeft' || e.code === 'KeyA'){
        //move player left -> add velocity in the left direction by subtracting from current x
        Body.setVelocity(maze.player, { x: Math.max(x-2, -speedLimit), y });
    } else if(e.code === 'ArrowRight' || e.code === 'KeyD'){
        //move player right -> add velocity in the right direction by adding to current x
        Body.setVelocity(maze.player, { x: Math.min(x+2, speedLimit), y });
    }
});

//win condition - game over
//use the Events module to listen for a colisionStart event
Events.on(engine, 'collisionStart', (e) => {
    //iterate over the pair array that is created when the event occurs,
    //that contains info about which bodies were involved in that collision

    e.pairs.forEach((collision) => {
        //array with the labels that are applied to the bodies that we want to check if they were the ones that collided
        const labels = ['player', 'goal'];
        //since we can't be sure which shape will be assigned to BodyA or BodyB upon collision,
        //our if statement needs to check if both BodyA and BodyB contain one of the labels
        //since each label only appear once, this means that we are looking to have both labels applied, one to BodyA and other to BodyB
        if(labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            levelComplete(collision.bodyA, collision.bodyB);
        }
    });
});