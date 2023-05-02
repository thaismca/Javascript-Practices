# Practice Project - Maze Game

This project implements a Maze game, where the player has to bring the ball from the starting point at the upper-left corner of the screen to the goal at the bottom-left corner, following the one possible clear path between these two points. The ball can be controlled using the arrow keys of the keyboard.

![Maze Game screenshot](https://github.com/thaismca/Javascript-Practices/blob/b4db6181e51d2ec258854dfa91fba423e0c6ce38/maze-game.PNG?raw=true )

Each time the player reaches the goal, the game asks if they want to restart it or move to the next level, where more rows and columns are added to the maze to make it more challenging.

## Key differences from course solution

The course implementation accounted for only one level and no option to restart or move to a next level once the player reaches the goal. These were features I added to the scope to have some extra challenge when coding it.


## Game loop implementation steps

**1. Create a maze**

There are many algorithms to generate a maze. This project was an opportunity to practice a bit more with tree data structure and recursion to implement the simplest algorithm.

**2. Draw maze on the screen**

Matter JS was used to draw the maze onto a canvas element

**3. Use keys to control the ball**

Matter JS has the ability to map key presses to movements of shapes

**4. Detect if player reached the maze goal**

Matter JS has the ability to detect collisions between different shapes and report them to us as events 

## Matter JS
A 2D rigid body physics engine for the web.

Documentation: brm.io/matter.js

### Terminology
- **World:** object that contains all of the different 'things' in our matter app.
- **Engine:** reads in the current state of the world from the world object, then calculates changes in positions of all the different shapes.
- **Runner:** gets the engine and world to work together, and runs about 60 times per second.
- **Render:** whenever the engine processes an update, render will take a look at all the different shapes and show them on the screen.
Body: A shape that we are displaying, and can be a circle, rectangle, oval, etc.

## Maze Generation Algorithm
- Create a grid of cells;
- Pick random starting cell;
- For that cell, build a randomly-ordered list of neighbors;
- If a neighbor has been visited before, remove it from the list;
- Considering only the remaining neighbors, 'move' to one of them and remove the wall between those two cells;
- Repeat steps 3-5 for this new neighbor;
- If no moves are possible when reaching a cell but there are still unvisited cells, backtrack until a cell that does have a valid neighbor to move to is found;
- Repeat steps 3-5