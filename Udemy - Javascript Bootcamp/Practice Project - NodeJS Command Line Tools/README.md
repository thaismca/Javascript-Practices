# Practice Project - NodeJS CLI Tool

Command line tool that shows the data set names under the a given working directory. It is a reimplementation from scratch of the UNIX method ls.

Practice goals:
- Introduction to NodeJS.
- Get a handle on the NodeJS Standard Library.
- Get more practice with topics around assync programming and some array methods.

## App Overview

If you run a Linux based machine, or a Mac based machine, or even a Windows machine with a Linux terminal emulator, there's a command that can be run at the terminal to print out the different files and folders inside of some directory ***-> ls***.

The ***ls*** command can be used in two ways
- no arguments: prints out files and folders in the current directory
- with a path: prints out files and folders in relative or absolute path

In this project, NodeJS was used to re-implement this basic functionality around the ls command. A version of ls that can run directly at the terminal, inside of any project or any directory on the machine, and just print out all the files and folders inside there.

This implementation color codes the name of the directories and files that are listed. Files are displayed in yellow and have their extension displayed along with the respective filenames. Folder names are displayed in green.


## Installation and use
### Requirements
- must have node.js installed
### Installation teps
- clone this project locally
- open the project directory in your terminal
- run command *npm install* to install dependencies
- run command *npm link* in the project directory to take this project and make it globally available everywhere else in the machine
### Using the commmand
- open terminal
- run the command *nls* to get a list of all the files and folders in the current directory
- run the command *nls* passing a given path to get a list of all the files and folders in the directory that was passed