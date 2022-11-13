#!/usr/bin/env node

//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly


//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

//this const fs now holds an object containing all pieces of functionality that are stuffed into the file system module
//so now in this object we can get access to every single function listed in the File System module documentation

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

//manually wrap the lstat function in a  promise
const lstat = (file) => {
    return new Promise((resolve, reject) => {
        fs.lstat(file, (err, stats) => {
            //if an error is returned from the lstat call, reject the promise
            if(err){
                reject(err);
            }
            //resolve with the stats data that is returned from the lstat call (when no error)
            resolve(stats); 
        })
    })
}