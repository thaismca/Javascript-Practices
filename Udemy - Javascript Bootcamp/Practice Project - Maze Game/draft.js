//file to store code that was first written to understand some concepts and that will end up being refactored in the app.js file
//so I can easily access older notes and implementations when studying
//NOTE: trying to actually use this script will cause errors

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