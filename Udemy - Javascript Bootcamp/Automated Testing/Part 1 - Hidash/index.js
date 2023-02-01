module.exports ={
    //reimplementation of the forEach function
    //it receives two arguments: the collection to iterate over and the function invoked per iteration
    forEach(arr, func) {
        /*//implement using a regular for loop to iterate over the collection
        for (let i = 0; i < arr.length; i++) {
            //pull out the value at the index
            const value = arr[i];
            //invoke func passing in the value and the index
            func(value, i);
        }*/

        //implementing using a for in loop to iterate over the collection
        for (let index in arr) {
            func(arr[index], index);
        }
    },

    //reimplementation of the map function
    //it receives two arguments: the collection to iterate over and the function invoked per iteration 
    //it creates an array of values by running each element in collection thru the callback function
    map(arr, func) {
        let result = [];
        for (let index in arr) {
            result.push(func(arr[index], index));
        }
        return result;
    }
};