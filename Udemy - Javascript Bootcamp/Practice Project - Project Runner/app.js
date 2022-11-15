#!/usr/bin/env node

//get access to the chokidar package inside of this project
//package that will be used to detect when file changes, are added or unliked
const chokidar = require('chokidar');

//use chokidar to watch the current directory
//instead of chain on an event listener to watch for all event types covered by chokidar
//add listeners for when a file is added, changed or unlinked from the directory
chokidar.watch('.')
    .on('add', () => console.log('FILE ADDED'))
    .on('change', () => console.log('FILE CHANGED'))
    .on('unlinked', () => console.log('FILE UNLINKED'));

//ISSUE WITH ADD EVENT: the 'add' callback is not only going to be invoked whenever a new file is created inside of the project 
//directory, but it will also be called when chokidar first starts up and sees a file inside of the project direcory. So when 
//the program is started we immediately see a tons of different 'FILE ADDED' console logs statements.