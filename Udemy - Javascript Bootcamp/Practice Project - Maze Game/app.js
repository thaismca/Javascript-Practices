//getting access to some objects out of the Matter JS library 
//Engine: will be used to make transitions from a current state of our entire world into some new state
//Render: is going to be use to draw stuff onto the screen
//Runner: is going to coordinate updates between the engine and the world
//Bodies: a reference to the entire collection of all the different shapes we can create
const { Engine, Render, Runner, World, Bodies } = Matter;

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

//create a new shape, passing the shape's position and size
//note: isStatic is a property that creates a shape that doesn't move at all (not even affected by gravity)
const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: true});
//add the shape to the world -> shape won't appear in world without this
World.add(world, shape);

//non static shape, to demonstrate gravity when isStatic is not set to true
const shape2 = Bodies.rectangle(380, 200, 50, 50);
World.add(world, shape2);