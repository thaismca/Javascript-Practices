#!/usr/bin/env node

//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly


//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

//this const fs now holds an object containing all pieces of functionality that are stuffed into the file system module
//so now in this object we can get access to every single function listed in the File System module documentation

//get access to the Utilities module from Node.js inside of this project
const util = require('node:util');

//from this module, we are going to use the promisify method, that takes a function following the common error-first callback style
//, i.e. taking an (err, value) => ... callback as the last argument, and returns a version that returns promises

//using promisify method to wrap the lstat function in a promise 
const lstat = util.promisify(fs.lstat);

fs.readdir(process.cwd(), async (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //CALLBACK-BASED SOLUTION USING PROMISES
    //this part doesn't change, either manually wrapping the lstat function in a promise or using node built-in methods to assist
    for(let file of files) {
        try{
            const stats = await lstat(file);
            console.log(file, stats.isFile());
        }
        catch(err) {
            console.log(err);
        }  
    }

});