//get access to the File System Module from Node.js inside of this project
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
//get access to the Path Module from Node.js inside of this project
//The node:path module provides utilities for working with file and directory paths
const path = require('node:path');

class Runner {
    constructor() {
        //store references to every test file that is discovered
        this.testFiles = [];
    }
    
    //method that find all files ending in '*.test.js' recursively through a folder
    //and stores a reference to each file that is found
    async collectFiles(targetPath) {
        //read the contents of the targetPath directory
        const contents = await fs.promises.readdir(targetPath);

        //iterate through the array of files found in the directory
        for(let content of contents) {
            //get a reference to the content's path
            const contentPath = path.join(targetPath, content);
            //get a reference to the content's stats
            const stat = await fs.promises.lstat(contentPath);

            //check if that content is a file AND it's name includes '.test.js' 
            if(stat.isFile() && content.includes('.test.js')) {
                //add that file path to the array that keeps track of all test files
                this.testFiles.push({ path: contentPath });
            }
            //check if that content is a folder
            else if (stat.isDirectory()){
                //get a reference to all the content inside of that folder
                const childContents = await fs.promises.readdir(contentPath);
                //add the elements from childContents to the array that we are currently iterating thru
                //but also adding the current content to the path in order to be able to reach the child correctly
                contents.push(...childContents.map(child => path.join(content, child)));
            }
        }
    }

    //method that iterates through the testFiles and execute them
    async runTests() {
        for (let testFile of this.testFiles) {
            //define a global beforeEach method
            const beforeEaches = [];
            global.beforeEach = (func) => {
                //hold references to all the callbacks passed to all beforeEach calls in the test script
                beforeEaches.push(func);
            }

            //define a global it method
            global.it = (desc, func) => {
                //environment setup
                //for each beforeEach callbacks that we have a reference to, execute that fucntion
                beforeEaches.forEach(fn => fn());

                //test execution
                //display the description of the test that was passed to the it() method
                console.log(desc);
                //execute the callback function that was passed to the it() method
                func();
            }

            //execute code inside of testFile
            require(testFile.path);
        }
    }
}

//make the class available to other files in this project
module.exports = new Runner;