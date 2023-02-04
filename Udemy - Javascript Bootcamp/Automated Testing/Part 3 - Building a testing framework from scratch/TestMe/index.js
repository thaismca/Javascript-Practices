#!/usr/bin/env node
//this line above is telling our computer we want to use Node to execute this file, as opposed to trying to execute this file directly

//require runner.js module
const runner = require('./runner');

console.log("Running TestMe......")

const run = async () => {
    await runner.collectFiles(process.cwd());
    console.log(runner.testFiles);
}

run();