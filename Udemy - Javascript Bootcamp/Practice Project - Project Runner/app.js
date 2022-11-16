#!/usr/bin/env node

//get access to the chokidar package inside of this project
//package that will be used to detect when file changes, are added or unliked
const chokidar = require('chokidar');
//get access to the lodash.debounce package inside of this project
//package contains one function, that is intended to solve the issue where a function is called way too often
const debounce = require('lodash.debounce');
//get access to the caporal package inside of this project
//package that will be used to build the CLI tool
const program = require('caporal');
//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

program
    //program version
    .version('0.0.1')
    //arguments that the program expects to be invoked with (second argument acts as documentation to help users)
    //file to execute will be optional
    //if user doesn't pass one, this program will try to find an app.js file inside of the current directory
    //if there's none, then an error message will be displayed
    .argument('[filename]', 'Name of a file to execute')
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
            throw new Error(`Could not find the file ${name}`);
        }
        
        //a function to be executed when chokidar emits an event
        //debounce the function so it doesn't get called too often
        const start = debounce(() => {
            console.log('STARTING USERS PROGRAM');
        }, 100);

        //use chokidar to watch the current directory
        //instead of chain on an event listener to watch for all event types covered by chokidar
        //add listeners for when a file is added, changed or unlinked from the directory
        chokidar
        .watch('.')
            .on('add', start)
            .on('change', start)
            .on('unlink', start);
            });

//execute program
program.parse(process.argv);



