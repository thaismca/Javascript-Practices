#!/usr/bin/env node

//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly


//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
const { stat } = require('node:fs/promises');

//this const fs now holds an object containing all pieces of functionality that are stuffed into the file system module
//so now in this object we can get access to every single function listed in the File System module documentation

//using lstat version from the fs Promises API method
const lstat = fs.promises.lstat; //alternatively const { lstat } = fs.promises

fs.readdir(process.cwd(), async (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    //PROMISE.ALL BASED SOLUTION
    //map over the files array and call lstat for each file -> create an array with the Promises that are returned from each lstat call
    const statPromises = files.map((file) => {
        return lstat(file);
    });

    //pass the statPromises array to Promise.all -> when all promises from the array are resolved,
    //Promise.all will return a new array containing all stats data inside of it -> allStats
    const allStats = await Promise.all(statPromises);

    //iterate over the allStats array
    for(let stats of allStats) {
        //get the index of the current element
        const index = allStats.indexOf(stats);
        //print out the element in files that matches the current allStats index, and whether it's a file or not
        console.log(files[index], stats.isFile());
    }
    
});