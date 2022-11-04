//getting access to some objects out of the Matter JS library 
//Engine: will be used to make transitions from a current state of our entire world into some new state
//Render: is going to be used to draw stuff onto the screen
//Runner: is going to coordinate updates between the engine and the world
//Bodies: a reference to the entire collection of all the different shapes we can create
//Body: has functions that are going to be used to manipulate body models
//Events: has methods to fire and listen to events on other objects
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

//some of the logic around the maze generation ends up being a lot easier to write if working with a perfect square canvas
const width = 600;
const height = 600;

//create a new engine
const engine = Engine.create();
engine.world.gravity.y = 0; //disables gravity in the y axis
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
        width,
        height
    }
 });
 //tell the render object to start working and draw all the updates of world onto the screen
Render.run(render);
//runner to coordinate all the changes from state A to state B of the engine
Runner.run(Runner.create(), engine);

//creating walls
const walls =[
    //for each wall, create a new shape, passing the shape's position and size
    //note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)
    Bodies.rectangle((width/2), 0, width, 3, {label: 'wall', isStatic: true}), //top wall
    Bodies.rectangle(0, (height/2), 3, height, {label: 'wall', isStatic: true}), //left wall
    Bodies.rectangle((width/2), height, width, 3, {label: 'wall', isStatic: true}), //bottom wall
    Bodies.rectangle(width, (height/2), 3, height, {label: 'wall', isStatic: true}), //right wall
]
//add the shape to the world -> shape won't appear in world without this
World.add(world, walls);


//-----MAZE GENERATION--------------------------------------------------------------------------------------------------------
//grid -> 2d array that tracks all the actual existing cells to record whether each one of them was already visited or not
//since upon initialization no cells are considered visited, each one will be initialized with 'false'

//verticals -> 2d array that tracks the walls between two different cells that are right next to each other on the same row
//horizontals -> 2d array that tracks walls between two different cells that are right next to each other on the same column
//absence of a wall between two cells -> true | presence of a wall between two cells -> false
//since upon initialization all walls will be present for all cells, each wall representation will be initialized with 'false'
//outter arrays always represent rows, inner arrays always represent columns

//maze config
//a const to represent the maze dimensions in number of cells (either vertically or horizontally, since we are working with square mazes)
const cells = 10;
//variables to represent the width and height of each cell
const unitWidth = width/cells;
const unitHeight = height/cells;


//const grid = Array(3) -> create an empty array that has 3 possible places in it
//.fill(null) -> add some values to those possible places just so they are initialized and I can iterate on them
//map -> map over the array and run a callback function for each one of the elements
//the callback will return an array of 3 elements with value of false -> Array(3).fill(false)
//so for each of the 3 elements of the grid array, we are going to add another array as [false, false, false]
const grid = Array(cells).fill(null).map(()=> Array(cells).fill(false));

//const verticals = Array(3) -> create an empty array that has 3 possible places in it to represent the rows in verticals (outter array)
//the callback in map will return an array of 2 elements with value of false, to represent the colums in verticals (inner array)
//so for each of the 3 elements of the grid array, we are going to add another array as [false, false]
const verticals = Array(cells).fill(null).map(() => Array(cells-1).fill(false));

//const horizontals = Array(2) -> create an empty array that has 2 possible places in it to represent the rows in horizontal (outter array)
//the callback in map will return an array of 3 elements with value of false, to represent the colums in horizontals (inner array)
//so for each of the 3 elements of the grid array, we are going to add another array as [false, false, false]
const horizontals = Array(cells-1).fill(null).map(() => Array(cells).fill(false));

//helper function that shuffles elements in an array and returns this shuffled array
const shuffle = (arr) => {
    //get the length of the array
    let counter = arr.length;
    //iterate over the array starting from the last element until it reaches the first one
    while(counter > 0) {
        //get a random index inside the array
        const index = Math.floor(Math.random() * counter);
        //decrease counter by 1
        counter --;
        //swap elements at the indexes represented by the values of index and counter
        const temp = arr[index];
        arr[index] = arr[counter];
        arr[counter] = temp;
    }
    //return shuffled array
    return arr;
};

//a recursive function that updates verticals and horizontals generating info that can be used to create a valid maze
const stepThroughCell = (row, column) => {
    //if the cell was already visited, then return (do nothing)
    if(grid[row][column] === true){
        return;
    }
    
    //mark this cell as being visited (update grid array)
    grid[row][column] = true;
    //assemble randomly-ordered list of neighbors using the shuffle helper function
    const neighbors = shuffle([
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
        if(nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells){
            //don't do anything else for this current iteration -> move on to the next neighbor of neighbors
            continue;
        }
        //if the neighbor was already visited, continue to next neighbor
        if(grid[nextRow][nextColumn] === true){
            continue;
        }
        //remove a wall from either horizontals or verticals, depending on the direction we are moving
        //up or down -> update horizontals | left or right -> update verticals
        //to update the walls in either direction, consider the position from the starting cell (row, column)
        //column doesn't change when moving up/down, and row doesn't change when moving left/right
        if(direction === 'up'){
            horizontals[row-1][column] = true;
        } else if(direction === 'down'){
            horizontals[row][column] = true;
        } else if(direction === 'left'){
            verticals[row][column-1] = true;
        } else if(direction === 'right'){
            verticals[row][column] = true;
        }

        //call stepThroughCell passing this neighbor nextRow and nextColumn
        stepThroughCell(nextRow, nextColumn); 
    }
};  

//generate the two random numbers that will represents the position of the cell that will be selected to start the maze generation from 
const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

//call StepThroughCell passing those random indices to update horizontals and verticals with info that can be used to create a valid maze 
stepThroughCell(startRow, startColumn);

//iterate over horizontals to draw horizontal walls based on the data in horizontals
horizontals.forEach((row, rowIndex) => {
    row.forEach((segment, columnIndex) => {
        if(segment === true) { //no wall
            return;
        }
        //create a rectangle that will represent the wall
        const xPos = (columnIndex * unitWidth) + (unitWidth/2);
        const yPos = (rowIndex * unitHeight) + unitHeight;
        const wall = Bodies.rectangle(xPos, yPos, unitWidth, 10, {isStatic: true});

        //add the wall to the world -> shape won't appear in world without this
        World.add(world, wall);
    });
});

//iterate over verticals to draw vertical walls based on the data in verticals
verticals.forEach((row, rowIndex) => {
    row.forEach((segment, columnIndex) => {
        if(segment === true) { //no wall
            return;
        }
        //create a rectangle that will represent the wall
        const xPos = (columnIndex + 1) * unitWidth;
        const yPos = (rowIndex * unitHeight) + (unitHeight/2);
        const wall = Bodies.rectangle(xPos, yPos, 10, unitHeight, {isStatic: true});

        //add the wall to the world -> shape won't appear in world without this
        World.add(world, wall);
    });
});

//-----MAZE GOAL----------------------------------------------------------------------------------------------------------------------------
//drawing the rectangle that represents the maze goal
const goal = Bodies.rectangle(
    //position -> middle of the cell in the bottom-right corner
    width - (unitWidth/2), //x position
    height - (unitHeight/2),  //y position
    //size -> scale with the unit size (60% of the unit size)
    unitWidth * 0.6, //goal width
    unitHeight * 0.6, //goal height
    { 
      //customize label (to make it easier to write function that detects collision)
      label: 'goal',
      //static shape
      isStatic: true
    }
);
//add the goal to the world -> shape won't appear in world without this
World.add(world, goal);

//-----MAZE PLAYER--------------------------------------------------------------------------------------------------------------------------
//drawing the circle that represents the maze player
const player = Bodies.circle(
    //position -> middle of the cell in the top-left corner
    unitWidth/2, //x position
    unitHeight/2,  //y position
    //size -> scale with the unit size (50% of the unit width)
    (unitWidth * 0.5)/2, //player radius
    { 
        //customize label (to make it easier to write function that detects collision)
        label: 'player',
        //frictionAir: makes body slow down when moving through space
        frictionAir: 0.05
    }
    
);
//add the goal to the world -> shape won't appear in world without this
World.add(world, player);

//player key controls
document.addEventListener('keydown', e => {
    //a reference to the player's current velocity
    const {x, y} = player.velocity;
    //a limit to the speed that the ball can reach, to prevent it from moving too fast
    const speedLimit = 3;
    if(e.code === 'ArrowDown' || e.code === 'KeyS'){
        //move player down -> add velocity in the down direction by adding to current y
        Body.setVelocity(player, { x, y: Math.min(y+1, speedLimit) });
    } else if(e.code === 'ArrowUp' || e.code === 'KeyW'){
        //move player up -> add velocity in the up direction by subtracting from current y
        Body.setVelocity(player, { x, y: Math.max(y-1, -speedLimit) });
    } else if(e.code === 'ArrowLeft' || e.code === 'KeyA'){
        //move player left -> add velocity in the left direction by subtracting from current x
        Body.setVelocity(player, { x: Math.max(x-1, -speedLimit), y });
    } else if(e.code === 'ArrowRight' || e.code === 'KeyD'){
        //move player right -> add velocity in the right direction by adding to current x
        Body.setVelocity(player, { x: Math.min(x+1, speedLimit), y });
    }
});

//-----WIN CONDITION----------------------------------------------------------------------------------------------------------------------
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
            //animation that makes everything inside the walls to fall appart
            //enable gravity in the y axis
            world.gravity.y = 1;
            //setStatic to false for all bodies except the walls and the player
            world.bodies.forEach((body) => {
                if(body.label !== 'wall' && body.label !== 'player'){
                    Body.setStatic(body, false);
                }
            });

        }
    });
});