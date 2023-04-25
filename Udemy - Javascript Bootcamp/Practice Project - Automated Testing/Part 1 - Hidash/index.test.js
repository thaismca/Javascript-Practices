//get access to the assert module from the node standard library
const assert = require('node:assert');
//get access to the functions in the index.js file
const { forEach, map } = require('./index.js');

//helper function to execute test cases
//it receives a description and a function to be invoked in the arguments
const test = (desc, func) => {
    console.log(`----- ${desc}`);
    try {
        func();
    } catch (err) {
        console.log(err.message);
    }
}

//testing the forEach function
//Case 1: call a function that sums all the elements in an iterable with an array of [1, 2, 3]
//Expected output: 6
test('Testing the forEach function', () => {
    let sum = 0;
    forEach([1, 2, 3], value => {
        sum += value;
    });
    assert.strictEqual(sum, 6, 'Expected forEach to sum the array');
});

//------------------------------------------------------------------------------------------------------------------
//testing the map function
//Case 1: call a function that squares each of the elements in an iterable with an array of [2, 3, 4]
//Expected output: [4, 9, 16]
test('Testing the map function', () => {
    const squares = map([2, 3, 4], value => {
        return value * value;
    });
    //assert.strictEqual(squares[0], 4);
    //assert.strictEqual(squares[0], 9);
    //assert.strictEqual(squares[0], 16);
    assert.deepStrictEqual(squares, [4, 9, 16]);
});
