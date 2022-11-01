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
        width: 800,
        height: 600
    }
 });
 //tell the render object to start working and draw all the updates of world onto the screen
Render.run(render);
//runner to coordinate all the changes from state A to state B of the engine
Runner.run(Runner.create(), engine);

//create a mouse constraint and add it to the world
//the mouse constraint creation can be handled when passing the constraint to the add function (no need to declare beforehand)
//to create a mouse constraint, the arguments that need to be passed are the engine and a reference to the mouse input (Mouse.create(element))
World.add(world, MouseConstraint.create(engine, {mouse: Mouse.create(render.canvas)}));

//creating walls
const walls =[
    //for each wall, create a new shape, passing the shape's position and size
    //note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)
    Bodies.rectangle(400, 0, 800, 30, {isStatic: true}), //top wall
    Bodies.rectangle(0, 300, 30, 600, {isStatic: true}), //left wall
    Bodies.rectangle(400, 600, 800, 30, {isStatic: true}), //bottom wall
    Bodies.rectangle(800, 300, 30, 600, {isStatic: true}), //right wall
]
//add the shape to the world -> shape won't appear in world without this
World.add(world, walls);



//create a new shape, passing the shape's position and size
//note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)
const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: true});
//add the shape to the world -> shape won't appear in world without this
World.add(world, shape);

//non static shape, to demonstrate gravity when isStatic is not set to true
const shape2 = Bodies.circle(380, 200, 25);
World.add(world, shape2);

//create a new polygon shape, passing the shape's position, sides and radius
const shape3 = Bodies.polygon(520, 200, 6, 25, { isStatic: true});
World.add(world, shape3);