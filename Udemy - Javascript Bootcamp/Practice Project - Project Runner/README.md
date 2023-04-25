# Practice Project - Project Runner

Command line tool that watches for changes in the directory that contains a given js file, and reruns that file any time a change is detected. It is a reimplementation from scratch of the node command --watch.

## Challenges

These were the challenges within the scope of the project proposed in the course.

**1 - Need to detect when a file changes**
The goal is to restart a program not only when the js file that we are executing gets changed, but to watch the entire folder and see if anything in it changes (files are editted, added or removed).

chokidar -> package that is used to detect file changes
Minimal and efficient cross-platform file watching library
https://www.npmjs.com/package/chokidar

**2 - Need to make it more user friendly**

The goal is to have other people using the tool easily, so it integrates a help system into it, to make it more obvious to other engineers how to use the program.

caporal -> package that is used to build the CLI tool. A full-featured framework for building command line applications (cli) with node.js, including help generation, colored output, verbosity control, custom logger, coercion and casting, typos suggestions, and auto-complete for bash/zsh/fish.
https://www.npmjs.com/package/caporal

**3 - Need to figure out how to execute some JS code from within a JS program**

child_Process -> standard library module that will be used to execute a program
The node:child_process module provides the ability to spawn subprocesses

## Added challenges
To add to the scope of the project proposed during the course, I wanted to display a message in the log to let user know the reason why the child process is being restarted. In order to do that:

- renamed start to startProcess
- startProcess is not being directly called when the event chokidar is watching to is emitted
- created a different function to be called by each event, and these functions will first show a log to let user know what happened, then execute the child process
- added the 'ready' process to be watched by chokidar, so the program could have a better log for when the process starts for the first time
- since now the program listens for 'ready', it was possible to use the ignoreInitial option and no longer need debounce, since 'add' will only be emitted when a file is added after 'ready' event



## Installation and use
### Requirements
- must have node.js installed
### Steps
- clone this project locally
- open the project directory in your terminal
- run command *npm install* to install dependencies
- run command *npm link* in the project directory to take this project and make it globally available everywhere else in the machine
### Watching a project
- open terminal and navigate to the project directory where there's a js file you want to restart execution whenver a change is detected in its directory
- run the command *watchit* and pass the name of the js file you want to execute
- if no filename is provided, the program will try to find and run a app.js file in the current directory