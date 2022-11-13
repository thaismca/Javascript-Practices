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

    //CALLBACK-BASED SOLUTION
    //create an array (allStats) which length is going to be equal the number of calls we expect to have
    //inside this array, every element is going to start off as 'null'
    const allStats = Array(files.length).fill(null);

    for(let file of files){
        //get the index of the current element
        const index = files.indexOf(file);
        
        fs.lstat(file, (err, stats) => {
            if(err){
                console.log(err);
            }
            //add the stats to the appropriate position of the allStats array (matching the index of current file of filenames)
            allStats[index] = stats;

            //check if there are still null values in the allStats array
            //ready will be true only if there are no falsy returns from any of the elements in the allStats array
            const ready = allStats.every((stats) => {
                return stats;
            });

            //if there are no null elements in allStats
            if(ready){
                //iterate over the allStats array
                allStats.forEach((stats, index) => {
                    //print out the element in files that matches the current allStats index, and whether it's a file or not
                    console.log(files[index], stats.isFile());
                });
            }
        });
    }
});