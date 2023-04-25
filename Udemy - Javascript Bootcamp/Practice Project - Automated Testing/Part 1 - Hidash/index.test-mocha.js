//Getting the same test scripts from index.test.js to run with mocha

//get access to the assert module from the node standard library
const assert = require('node:assert');
//get access to the functions in the index.js file
const { forEach, map } = require('./index.js');

//removed the helper function, because it's no longer needed -> we are going to use it, from mocha

//testing the forEach function
//Case 1: call a function that sums all the elements in an iterable with an array of [1, 2, 3]
//Expected output: 6
it('Testing the forEach function', () => {
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
it('Testing the map function', () => {
    const squares = map([2, 3, 4], value => {
        return value * value;
    });
    assert.deepStrictEqual(squares, [4, 9, 16]);
});
