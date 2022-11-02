//getting access to some objects out of the Matter JS library 
//Engine: will be used to make transitions from a current state of our entire world into some new state
//Render: is going to be used to draw stuff onto the screen
//Runner: is going to coordinate updates between the engine and the world
//Bodies: a reference to the entire collection of all the different shapes we can create
//MouseConstraint: contains methods for creating mouse constraints that are used for allowing user interaction via mouse or touch
//Mouse: contains methods for creating and manipulating mouse inputs
const { Engine, Render, Runner, World, Bodies } = Matter;

//some of the logic around the maze generation ends up being a lot easier to write if working with a perfect square canvas
const width = 600;
const height = 600;

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
    Bodies.rectangle((width/2), 0, width, 30, {isStatic: true}), //top wall
    Bodies.rectangle(0, (height/2), 30, height, {isStatic: true}), //left wall
    Bodies.rectangle((width/2), height, width, 30, {isStatic: true}), //bottom wall
    Bodies.rectangle(width, (height/2), 30, height, {isStatic: true}), //right wall
]
//add the shape to the world -> shape won't appear in world without this
World.add(world, walls);


//-----MAZE GENERATION--------------------------------------------------------------------------------------------------------
//grid -> 2d array that tracks all the actual existing cells to record whether each one of them was already visited or not
//since upon initialization no cells are considered visited, each one will be initialized with 'false'
//at first, a 3x3 grid will be hardcoded, but this is going to be refactored later

//const grid = Array(3) -> create an empty array that has 3 possible places in it
//.fill(null) -> add some values to those possible places just so they are initialized and I can iterate on them
//map -> map over the array and run a callback function for each one of the elements
//the callback will return an array of 3 elements with value of false -> Array(3).fill(false)
//so for each of the 3 elements of the grid array, we are going to add another array as [false, false, false]
const grid = Array(3).fill(null).map(()=> Array(3).fill(false));
console.log(grid)