#!/usr/bin/env node

//get access to the chokidar package inside of this project
//package that will be used to detect when file changes, are added or unliked
const chokidar = require('chokidar');
//get access to the caporal package inside of this project
//package that will be used to build the CLI tool
const program = require('caporal');
//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
//get access to the spawn function of the Child Process Module from Node.js inside of this project
//this method can be used to spawn a new subprocess
const { spawn } = require('node:child_process');
//get access to the chalk package inside of this project
//package that will be used to style console outputs
const chalk = require('chalk');

program
    //program version
    .version('0.0.1')
    //arguments that the program expects to be invoked with (second argument acts as documentation to help users)
    //file to execute will be optional
    //if user doesn't pass one, this program will try to find an app.js file inside of the current directory
    //if there's none, then an error message will be displayed
    .argument('[filename]', 'Name of a js file to execute')
    //function to be invoked when user executes the program
    //passing an array containing all arguments that were passed in the execution call
    .action( async ({ filename }) =>{
        //check to see if a file name was provided by the user - if not, default to app.js
        const name = filename || 'app.js';
        //whatever file name we end up with, make sure that the file actually exists in the current directory
        try{
            //use the access function from the fs/promises API, that provides asynchronous file system methods that return promises
            await fs.promises.access(name);
        }
        //if cannot find the file, the promise is rejected with an error 
        catch(err){
            throw new Error(chalk.red(`Could not find the file ${name}`));
        }
        
        //variable to track if there's a subprocess currently running
        let proc;
        //a function to start the child process
        const startProcess = () => {
            //check if there's a subprocess currently running -> kill it
            if(proc){
                proc.kill();
            }
            //notify user that a new version of the program is running
            console.log(chalk.blue.bold('>>>>>>> Starting process...'));
            //spawn a subprocess that will run the node command passing in the file name to be executed with node in the args
            //the stdio set to inherit will allow the logs and errors from this subprocess to be displayed using the main process stdio
            proc = spawn('node', [name], { stdio: 'inherit' });
        };

        //a function to be invoked when chokidar emits a 'ready' event
        //it notifies user that the initial scan is completed and the starts the child process execution
        const ready = () => {
            console.log(chalk.yellow.bold('Initial scan complete.'));
            startProcess();
        };

        //a function to be invoked when chokidar emits an 'add' event
        //it notifies user which file was added and the restarts the child process execution
        const added = (path) => {
            console.log(chalk.yellow.bold(`File added: ${path}`));
            startProcess();
        };

        //a function to be invoked when chokidar emits a 'change' event
        //it notifies user which file was changed and the restarts the child process execution
        const changed = (path) => {
            console.log(chalk.yellow.bold(`File changed: ${path}`));
            startProcess();
        };

        //a function to be invoked when chokidar emits an 'unlinked' event
        //it notifies user which file was deleted and the restarts the child process execution
        const unlinked = (path) => {
            console.log(chalk.yellow.bold(`File deleted: ${path}`));
            startProcess();
        };

        //use chokidar to watch the current directory
        //instead of chain on an event listener to watch for all event types covered by chokidar
        //add listeners for when the initial scan is completed, and when a file is added, changed or unlinked from the directory
        //ignoreInitial: true -> add event won't trigger before 'ready' event
        chokidar
        .watch('.', { ignoreInitial: true })
            .on('ready', ready)
            .on('add', added)
            .on('change', changed)
            .on('unlink', unlinked);
    });

//execute program
program.parse(process.argv);



