# TestMe Testing Framework

This project implements a testing framework from scratch: TestMe

## TestMe features
- node-based CLI framework
- it's able to test browser-based JS apps
- requires very little setup
- it's able to test a whole application, not just one little widget
- CLI has a 'watch mode', so we don't have to keep restarting it over and over
- CLI automatically finds and runs all files in the project that have a name of '.test.js

## Installation and use

### Requirements
- must have node.js installed

### Steps
- clone this project locally
- open the project directory in your terminal
- run command *npm install* to install dependencies
- run command *npm link* in the project directory to take this project and make it globally available everywhere else in the machine

### Testing a project
- create testing scripts with the extension *.test.js* that tests features in your project
- open terminal and navigate to the project directory that you want to run the tests
- run the command *testme* 

## How it works

### 1. File Collection

CLI automatically finds and run all files in a given project that have a name of *.test.js.* So, whenever the command line tool is ran, the program takes a look at the project directory that the command line tool is being executed from and find all the different test files inside of this project directory.

### 2. Test Environment Setup
    
Once all those different files have been collected, some environment setup is done before running any tests. In this project, this setup is done by getting all invokes for beforeEach() in a test script and running them all before executing the callback function that was passed to it().

### 3. Test File Execution
    
Once the environment set up is done, then each test file is actually executed, by running each little *it()* statement, one by one at a time, and watch for any errors that might occur.

### 4. Report Results
    
Once all the results from all these different tests have been collected, it tabulates all that data and prints out the results to the terminal so that the developer who is using the tool understands what test failed and what test actually passed.


## Implementation notes

### runner.js

This file is contains a bunch of code related to the entire process of:

- Find all files ending in '*.test.js' recursively through a folder
- Store a reference to each file we find
- After getting a full list of the test files, execute them one by one

**Note:** the actual test environment setup resides inside of a different file.

In order to organize the code, a class was used to group together all this functionality, and then exported so it can be available to other files inside of this project.

- **constructor:** contains an instance variable that's going to store a reference to every file that we discover.

- **collectFiles:** method that implements a modified breadth first search to iterate recursively through a folder, find all files ending in '*.test.js', and store a reference to each file that is found. It taked an argumetn of targetPath, which going to be the entire absolute path to some folder that we want to investigate on our local machine.

    #### Modified breadth search

    Normally, a breadth search would take all children from an element in a tree and add them to an array. Then start to iterate through the array, take a look at each individual item, and for each item find all of its children and add them all to the array. This process would continue until all elements of the tree were finally added to that array. In this application, these children are added into this array to iterate over only if they are folders. Files with .test.js extension are added to the array that keeps track of all of the different test files (this.testFiles). And if it's not a test file or a folder, then it's basically ignored.

- **runTests:** method that iterates through the testFiles and execute them. It doesn't create a new and separate process from the current program that we are running. It actually executes all the code inside of the test files in the same context as our runner, which makes it a lot earsier to shaer information between the test file and the test runner.


### Implementing 'beforeEach' and 'it'
In order to be able to actually run the *.test.js* scripts, it's still necessary to globally define the *beforeEach* and *it* methods. Similar to the Mocha framework, the *it()* function is used to execute individual tests, and *beforeEach()* is used to reset the environment before each call of the callback passed to the *it()* method. Both methods are globally defined, which means that they are available inside of every file and shared between every file as well.

- **it(desc, func)** : where desc is a string with a description for the test that is being executed, and func is the callback function that execute assertions.
- **beforeEach(func)** : where func is the callback function to be executed when it() is invoked, before actually running the callback that is passed to it().

### Running browser-based JS

One of the requirements of this TestMe application is to be able to test browser-based JS apps, even though it runs some code based on Node.js. The whole issue here is that with Node.js we do not have access to the browser, and that browser based app is going to try to access the DOM use methods that are built into the browser and so on. In order to solve this, we're going to run a little library inside of this testing tool that is going to simulate a browser inside of Node.js.

#### JSDOM
Documentation: https://www.npmjs.com/package/jsdom

JSDOM is a pure-JavaScript implementation of many web standards, notably the WHATWG DOM and HTML Standards, for use with Node.js. In general, the goal of the project is to emulate enough of a subset of a web browser to be useful for testing and scraping real-world web applications.

There is no actual window that pops up and shows web pages or anything like that. Instead, it is a reimplementation of a lot of the code that runs in the browser. And so when we make use of JSDOM, we can pretend as though we have access to a browser, even though there is not actually a browser present.

#### fromFile()

The fromFile function included with JSDOM is going to be called with a reference or the name of some HTML document that we want to load up when we call this function. Then JSDOM is going to look for a file on our hard drive that has that name, read the contents of that HTML file and try to load it up into this kind of virtual 
browser environment. Once JSDOM loads out that HTML document, it is also going to load up any associated JavaScript files as well. In other words, JSDOM is going to take in these two files and it's going to assemble a virtual representation of our application. That's going to give us back an object that we can use to kind of poke and prod at to make sure that our application is working the way we expect.

*How this funtion is used in the TestMe application?*

For every single test statement that is put together, *fromfile* is called. So for every test, a fresh version of the entire application that's going to give us back this object that represents the entire DOM is loaded up. It's possible to call different methods on that thing to manipulate all the different elements inside there.

The *fromFile* function in the TestMe application also receives an options object, setting two different properties:

 - **runScripts: "dangerously"** -> to enable executing scripts inside the page
 - **resources: "usable"** -> to enable executing external scripts, included via script tag.

**NOTE:** it's advised to only use this when feeding jsdom code you know is safe. If you use it on arbitrary user-supplied code, or code from the Internet, you are effectively running untrusted Node.js code, and your machine could be compromised.

If the given file can be opened, the returned promise will fulfill with a JSDOM instance, an object that represents all the HTML that's inside there and then we can start to inspect it and write our tests.

#### render() 

This method receives the name of the HTML file that is supposed to be passed to the JSDOM fromFile() method, which will be eventually called inside of the render function. The whole idea here is to have devs who are using this test framework to be able to call, render and get access to some like live HTML document inside of their test code. So this render function is made globally available inside of the runner, so the developers writting scripts to test their web-based applications can make use of it.
______

***IMPORTANT NOTE:***

In the course, *render()* was implemented in a separated file and exported to only be made available globally in the runner. But there's was a limitation with the implemetation regarding the ability to run the testme command from the root directory of a project, access test files placed in folders inside of it and have the HTML correctly rendered. The course implementation was done considering that the testme command would always be ran from the same directory where the test file was placed in, and it wasn't covering cases where that wasn't the case. In this implementation, render() is being declared inside the runner, and made available the same way as beforeEach() and it(), since a reference to the test file path was needed in order to resolve the path for the filename passed to render. This makes it possible to ruccessfully run all '.test.js' files placed in nested folders inside of the directory where the test command is ran from, as long as the call for render is made passing a correct relative path for the HTML file to be loaded, considering the test file location.
_____


#### Delaying script execution
As soon as the promise returned from *fromFile* is fullfiled, if the JSDOM instance is returned right away, the program continues execution and the tests start to run. The problem is that just loading up the HTML file and parsing the HTML doesn't actually complete the entire loading process of the application. So the JSDOM instance from the render function must not be returned until after all the associated scripts and resources have been loaded up inside of that object.

This was achieved by performing the following steps:
    
**1.** Set up an event listener that's going to watch for all the different things that we're referencing inside of our DOM to be loaded -> DOMContentLoaded.

**2.** Wrap it inside of a promise that won't be resolved until after this event gets triggered.

**3.** This promise will be resolved with the JSDOM instance.

**4.** This promise is what's going to be returned from the render function, making the JSDOM instance available only after the DOMContentLoaded is triggered.