//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script will cause errors

//This first part is basically what we need to add to the code whenever we want to start working with Matter JS
//getting access to some objects out of the Matter JS library 
//Engine: will be used to make transitions from a current state of our entire world into some new state
//Render: is going to be used to draw stuff onto the screen
//Runner: is going to coordinate updates between the engine and the world
//Bodies: a reference to the entire collection of all the different shapes we can create
//MouseConstraint: contains methods for creating mouse constraints that are used for allowing user interaction via mouse or touch
//Mouse: contains methods for creating and manipulating mouse inputs
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;

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
        height,
        wireframes: false
    }
 });
 //tell the render object to start working and draw all the updates of world onto the screen
Render.run(render);
//runner to coordinate all the changes from state A to state B of the engine
Runner.run(Runner.create(), engine);

//----------------------------------------------------------------------------------------------------------------------------------------

//whenever adding a new shape, this is the basic code
//each shape type will require different parameters to be created (width/height, radius, vertexSets, sides, slope)
//please refer to Matter JS documentation
//note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)

//create a new rectangle shape, passing the shape's position, width and height
const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: true});
//add the shape to the world -> shape won't appear in world without this
World.add(world, shape);

//create a new circle shape, passing the shape's position and radius
//non static shape, to demonstrate gravity when isStatic is not set to true
const shape2 = Bodies.circle(380, 200, 25);
World.add(world, shape2);

//create a new polygon shape, passing the shape's position, sides and radius
const shape3 = Bodies.polygon(520, 200, 6, 25, { isStatic: true});
World.add(world, shape3);

//-----------------------------------------------------------------------------------------------------------------------------------
//code that was used to create the fisrt demo, just to start working with Matter JS 

//create a mouse constraint and add it to the world
//the mouse constraint creation can be handled when passing the constraint to the add function (no need to declare beforehand)
//to create a mouse constraint, the arguments that need to be passed are the engine and a reference to the mouse input (Mouse.create(element))
World.add(world, MouseConstraint.create(engine, {mouse: Mouse.create(render.canvas)}));

const width = 800;
const height = 600;

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

//creating random shapes
for(let i = 0; i < 60; i++){
    //randomize the type of shape that is created and the position where the shape is created
    //in this case, the area where the shape can be created is limited by the canvas width and half of its height
    if(Math.random() > 0.33) {
        World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * (height/2), 50, 50));
    } else if(Math.random() > 0.66) {
        World.add(world, Bodies.circle(Math.random() * width, Math.random() * (height/2), 30));
    } else {
        World.add(world, Bodies.polygon(Math.random() * width, Math.random() * (height/2), 6, 30));
    }
}

//-----MAZE GENERATION--------------------------------------------------------------------------------------------------------
//grid -> 2d array that tracks all the actual existing cells to record whether each one of them was already visited or not
//since upon initialization no cells are considered visited, each one will be initialized with 'false'
//at first, a 3x3 grid will be hardcoded, but this is going to be refactored later

//this would be an initial approach to create a 3x3 grid
const grid = [];
for(let i = 0; i < 3; i++) {
    grid.push([]); //create row
    for(let j =0; j < 3; j++) {
        grid[i].push(false);
    }
}
