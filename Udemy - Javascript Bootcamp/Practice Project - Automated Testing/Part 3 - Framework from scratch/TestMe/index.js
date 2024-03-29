#!/usr/bin/env node
//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly

//require runner.js module
const runner = require('./runner');

const run = async () => {
    console.log("Running TestMe......");

    //find all files ending in '*.test.js' recursively through a folder
    await runner.collectFiles(process.cwd());
    //execute test files
    runner.runTests();
}

run();