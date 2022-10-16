//-----THE ASYNC KEYWORD ----------------------------------------------------------------------------------------------------
//here's how we create a function that returns a promise using what we learned so far
function add(x, y) {
    return new Promise((resolve, reject) => {
        if(typeof x !== 'number' || typeof y !== 'number')
         reject('X and Y must be numbers!');

        resolve (x + y);
    });
}

//the async keyword is a shortcut syntax to make a function that returns a promise
async function multiply(x, y) {
    if(typeof x !== 'number' || typeof y !== 'number')
        //it's goint to be either rejected with an error (throw)
        throw 'X and Y must be numbers!'

    //or resolved with a value (return)
    return x * y;
}

//both functions should still be called the same way
add(456, 'a')
.then((val) => {
    console.log(`Promise resolved with value: ${val}`);
})
.catch((err) => {
    console.log(`Promise rejected with error: ${err}`);
})

multiply(56, 89)
.then((val) => {
    console.log(`Promise resolved with value: ${val}`);
})
.catch((err) => {
    console.log(`Promise rejected with error: ${err}`);
})

//----------------------------------------------------------------------------------------------------------------------------
//-----THE AWAIT KEYWORD -----------------------------------------------------------------------------------------------------
//without async/await
function getPlanets(url = 'http://swapi.dev/api/planets') {
    axios.get(url).then((response) => {
        console.log(response.data);
    });
}

//using async/await
async function getPlanetsAsync(url = 'http://swapi.dev/api/planets') {
    const response = await axios.get(url); //await keyword is reserved to only be used inside of a async function
    //this next line will only run after the promise is resolved
    console.log(response.data);
}

//both functions should still be called the same way
getPlanets();
getPlanetsAsync();

//handling errors
//can do by attaching a .catch to the function call
getPlanetsAsync('http://swapi.dev/api/planets123').catch((err) => {
    console.log('IN CATCH!', err.message);
});

//could also handle the error by using a try/catch inside the async function
async function getPlanetsTryCatch(url = 'http://swapi.dev/api/planets') {
    try {
        const response = await axios.get(url); //await keyword is reserved to only be used inside of a async function
    //this next line will only run after the promise is resolved
    console.log(response.data);
    }
    catch(e) {
        console.log('IN CATCH!!', e.message);
    }   
}

getPlanetsTryCatch('http://swapi.dev/api/planets123');

//when it's only one function being called, using either method makes no difference, but when we have multiple
//chained requests, each approach will have its own different benefits - attaching the .catch after the function call
// would make it easier because you can use only one to catch all (same as we saw before with chained promises), 
// while try/catch makes it possible to give a more persnalized handling for rejection in each promise

//----------SEQUENTIAL VERSUS PARALLEL REQUESTS---------------------------------------------------------------------------
//sequential - the following request is only sent after the previous one is resolved
//makes sense to use this one if you have one requesting depending on the previous one, like when the first returns
//an url that will be passed in the following request (like we did in preious lessons)

//in this case, we have three requests happening in sequence, the following only being sent when the previous is resolved
//but it doesn't make sense to use this approach, since the request don't depend on one another
async function get3PokemonsSequential() {
    const pokemon1 = await axios.get('https://pokeapi.co/api/v2/pokemon/1');
    const pokemon2 = await axios.get('https://pokeapi.co/api/v2/pokemon/2');
    const pokemon3 = await axios.get('https://pokeapi.co/api/v2/pokemon/3');
    console.log(pokemon1.data);
    console.log(pokemon2.data);
    console.log(pokemon3.data);
}
//get3PokemonsSequential()

//we can have the requests from the previous function being sent all at the same time, in parallel
async function get3PokemonsParallel(){
    const promise1 = axios.get('https://pokeapi.co/api/v2/pokedmon/1');
    const promise2 = axios.get('https://pokeapi.co/api/v2/pokemon/2');
    const promise3 = axios.get('https://pokeapi.co/api/v2/pokemon/3');
    const poke1 = await promise1;
    const poke2 = await promise2;
    const poke3 = await promise3;
    console.log(poke1.data);
    console.log(poke2.data);
    console.log(poke3.data);
}
get3PokemonsParallel()