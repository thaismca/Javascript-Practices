//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');

//this const fs now holds an object containing all pieces of functionality that are stuffed into the file system module
//so now in this object we can get access to every single function listed in the File System module documentation
//the one we care about for the sake of this app is the readdir function, that reads the contents of a directory

fs.readdir('.', (err, files) => {
    //the callback gets two arguments (err, files) where files is an array of the names of the files in the directory

    //EITHER err === an error object, which means something wen wrong
    //OR err === null, which means everything is okay
    if(err) {
        //error handling code
        console.log(err);
    }

    console.log(files);
});