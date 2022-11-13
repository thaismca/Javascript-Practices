#!/usr/bin/env node

//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly


//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

//this const fs now holds an object containing all pieces of functionality that are stuffed into the file system module
//so now in this object we can get access to every single function listed in the File System module documentation
//the one we care about for the sake of this app is the readdir function, that reads the contents of a directory

fs.readdir(process.cwd(), (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //BAD CODE HERE
    //this won't print out all results in the same order every time nls is executed
    //when we run the for loop, we run all four calls to that lstat method in very quick succession, but the callback is not run instantly
    //it takes some time to retrieve info from the user's HD and this time can be different at each run of the lstat function
    for(let file of files){
        fs.lstat(file, (err, stats) => {
            if(err){
                console.log(err);
            }
            console.log(file, stats.isFile());
        });
    }

});