#!/usr/bin/env node

//get access to the chokidar package inside of this project
//package that will be used to detect when file changes, are added or unliked
const chokidar = require('chokidar');
const debounce = require('lodash.debounce');

//a function to be executed when chokidar emits a 'add' event
//debounce the function so it doesn't get called to often upon program start
const start = debounce(() => {
    console.log('STARTING USERS PROGRAM');
}, 100);

//use chokidar to watch the current directory
//instead of chain on an event listener to watch for all event types covered by chokidar
//add listeners for when a file is added, changed or unlinked from the directory
chokidar
.watch('.')
    .on('add', start)
    .on('change', () => console.log('FILE CHANGED'))
    .on('unlink', () => console.log('FILE UNLINKED'));