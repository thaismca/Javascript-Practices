//get access to the File System Module from Node.js inside of this file
//The node:fs module enables interacting with the file system
const fs = require('node:fs');
//get access to the Path Module from Node.js inside of this file
//The node:path module provides utilities for working with file and directory paths
const path = require('node:path');
//get access to the chalk package, to add colors to the console logs
const chalk = require('chalk');

//get access to the jsdom module from npm inside of this file
//emulates enough of a subset of a web browser to be useful for testing and scraping real-world web applications
const jsdom = require('jsdom');
//get a reference to the JSDOM constructor -> named export of the jsdom main module
const { JSDOM } = jsdom;

class Runner {
    constructor() {
        //store references to every test file that is discovered
        this.testFiles = [];
        //store directories that must be excluded from test file search
        this.ignoredDirs = ['node_modules'];
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
                this.testFiles.push({ path: contentPath, relPath: content });
            }
            //check if that content is a folder that is not added to the list of folders to be ignored
            else if (stat.isDirectory() && !this.ignoredDirs.some(dir => content.includes(dir))) {
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
            //indicate what file is about to be executed
            console.log(chalk.bgGray(`\n------- ${testFile.relPath}\n`));

            //define a global render method
            global.render = async (filename) => {
                //get a reference to the full path of filename
                const filePath = path.resolve(path.dirname(testFile.path), filename);
                
                //load up the HTML document
                const dom = await JSDOM.fromFile(filePath, {
                    //to enable executing scripts inside the page
                    runScripts: "dangerously",
                    //to enable executing external scripts, included via <script src="">
                    resources: "usable"
                });

                //return a promise that will delay the availbility of the JSDOM instance to the external world
                //dom will be available only after the DOMContentLoaded is triggered
                return new Promise((resolve, reject) => {
                    dom.window.document.addEventListener('DOMContentLoaded', () => {
                        resolve(dom);
                    })
                });
            }

            //define a global beforeEach method
            const beforeEaches = [];
            global.beforeEach = (func) => {
                //hold references to all the callbacks passed to all beforeEach calls in the test script
                beforeEaches.push(func);
            }

            //define a global it method
            global.it = async (desc, func) => {
                //environment setup
                //for each beforeEach callbacks that we have a reference to, execute that fucntion
                beforeEaches.forEach(fn => fn());

                //test execution
                //execute the callback function that was passed to the it() method
                try {
                    await func();
                    //display message for 'passed' test
                    console.log(chalk.bgGreen('\tPASSED'), chalk.green(desc), '\n');
                } catch(err) {
                    //preprocess error message for better formatting
                    const message = err.message.replace(/\n/g, '\n\t\t');
                    //display message for 'failed' test
                    console.log(chalk.bgRed('\tFAILED'), chalk.red(desc));
                    console.log('\t', message, '\n');
                }
            }

            //execute code inside of testFile
            try {
                require(testFile.path);
            } catch(err) {
                //display error message if an error occurred regarding the test file execution
                console.log(chalk.bgRed('\tFAILED'), chalk.red('Error loading file', testFile.relPath), '\n');
                console.log(err);
            }   
        }
    }
}

//make instance of the class available to other files in this project
module.exports = new Runner;