# Hidash

In this Part 1 of the Automated Testing Section,the goal was to:
- write a tiny node project -> Hidash
- figure out how to test it without any outside testing library
- test it using a testing library

## Context

There's an extremely popular Javascript library called Lodash, which provides a huge set of helper fuctions to do a lot of different operations that we commonly have to do by hand inside of Javascript. Documentation: https://lodash.com/docs/4.17.15

This small node project Hidash reimplements a couple of functions from the Lodash library.


### Functions to be reimplemented:

___1 - forEach___

Lodash reference: https://lodash.com/docs/4.17.15#forEach

This function behaves identically to the forEach function that is included with Javascript arrays. For many years Javascript did not have a built-in forEach method, so Lodash came along many years ago and gave developers a version of forEach.

The Lodash version of the forEach receives two arguments: the collection to iterate over and the function invoked per iteration. It iterates over elements of the collection and invokes a callback function for each element. The callback is invoked with three arguments: (value, index|key, collection). The callback functions may exit iteration early by explicitly returning false. First reimplementation of this method will be done using a regular for loop. Then in order to attest that our testing code continues to properly test the function after we change it, we are going to change it to use a for in loop. 

___2 - map___

Lodash reference: https://lodash.com/docs/4.17.15#map

This function also behaves identically to the map function that is included with Javascript arrays. It receives two arguments: the collection to iterate over and the function invoked per iteration. It creates an array of values by running each element in collection thru the callback function, which is invoked with three arguments (value, index|key, collection).

## Testing the code

The idea behind test automation is to run a code in an automated fashion and in several different styles to make sure that it works for every different case that we call the function that is being tested, instead of trying to run the code and then manually look at the output.

In order to test the functions that were implemented, we are ging to take two different approaches. In the first one, we'll be writting a test script without using an outside testing library. Then, we are going to test the same functions using a test library.

Note: two approaches were demonstrated in the course, the first one not making use of any external library, and the second one using mocha. The second approach would be a refactor to the fisrt one, but instead of making the changes in the index.test.js file itself, I decided to create a second file, so we could have both for comparison and study purposes. It's still possible to run the first approach using the ***'node index.test.js'*** command, and we can run the second approach with the ***'mocha index.test-mocha.js'*** command.

### First approach:  no outside testing library
In this approach, the testing script was placed in the following file 

-> **index.test.js**

The reason for this is that when we start to think about automated testing, we're really talking about running our entire application in two different contexts. The first context would be like if we wanted to run our program as usual and actually make use of the code inside of our very normal, very usual type of program. As soon as we start to want to test this code, however, we would not want to put some code inside of the program file that's going to actually test it.If we keep writting and leaving testing code inside of the program file and then ran our project, every single time we ran our project, we would see the logs of the test outputs. That would start to muddy up our program really quickly because we would get some console logs and whatnot completely unrelated to the actual purpose of our program.

Then, inside of the test script file, in order to write a test for the functions that we implemented without any outside library, we're going to do it in the most simple, basic, straightforward way possible: we're just going to require in our functions, we're going to call them, we're going to get some results out, and we're just going to make sure that the result that we got is what we expect.

**Issues identified**

**1 -** All variables inside of index.test.js are defined in the global scope of the file

This is a problem because if we want to reassign something to another result variable, if it was created as a constant, then it won't be possible to make the reassignment. Plus, ig get messy and confusing.

**2 -** If any of the tests in the file throws an error, then none of the following tests will be executed

This is a problem because if we want some sort of report on everything that is passing or failing in our application, not only just the first thing that goes wrong. 

**3 -** It's really hard to figure out where the error is if something goes wrong

The current implementation requires us to check the error message and then search through the entire scriptto figure out where it came from. Thisis already tiresome for a small file, and it can become a real nightmare if you have a longer script, or multiple messages that look alike.


**Solving the issues**

To start solving these issues, a helper function was created at the top of the testing file. It will receive two arguments: a description and a function to be invoked.

The description is to give us a better idea of what is actually being tested, especially in case we have multiple functions to be tested in one file (just like we currently have). We console.log this description when this helper function is called, before executing the next steps. This helps us solving problem number 3 in the list.

Then all the current testing logic was wrapped into a little callback function that gets provided to this helper function. By doing this, the variables are no longer declared in the global scope, which solves problem number 1.

Now, to solve problem number 2, in the helper function that we put together, we wrap the callback function call using a try/catch statement. We are going to call the function inside the try block, then catch any potential errors and console.log the messages from those errors, if they happen. By doing this, if something throws an error that's not going to end the execution of the entire program.

**Refactoring code to use the Assert module**

The assert module from the node standard library provides a set of assertion functions for verifying invariants. It helped us to clean up the code on this refactor and get rid of all repetitive if statements. We used its strictEqual method, which receives two arguments (actual and expected) and tests strict equality between the two. It can also receive a third option, which is a message to be displays if the values are not strictly equal. If the message parameter is undefined, a default error message is assigned. If the message parameter is an instance of an Error then it will be thrown instead of the AssertionError.

There's also a second method that can be used in out test script, to test the map function: deepStrictEqual. Tests for deep equality between the actual and expected parameters. "Deep" equality means that the enumerable "own" properties of child objects are recursively evaluated also by the following rules. In other words, I can compare the entire squares array to the expected array at once, not the value at one index at a time.

### Second approach:  using the testing library mocha
In this approach, the testing script was placed in the following file

-> ***index.test-mocha.js***

Mocha documentation can be found at: https://mochajs.org/

In order to use mocha, the fisrt step is to install it globally in the local machine by running the command 'npm install -g mocha'. After that, to get the same test script that was put togheter in the fisrt approach to run with mocha, we just needed to change a few things:

- the helper function could be deleted, since there's no need for it when using mocha
- so instead of calling the helper function to run the scripts, we will wrap then in the it() function

In Mocha, the it() function is used to execute individual tests. It accepts a string to describe the test and a callback function to execute assertions. So basically, we don't need to change a thing in the implementation of the callbacks we have from the first implementation. We only need to change the wrapping function that will eventually run then.