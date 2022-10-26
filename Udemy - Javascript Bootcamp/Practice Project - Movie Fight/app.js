//helper function to make HTTP request
const fetchData = async (searchTerm) => {
    //axios.get can receive an object with parameters in the arguments, to create a query string that will be added to the request url
    const response = await axios.get('http://www.omdbapi.com/', {
        //according to the API documentation, the apikey and a string s corresponding to a movie title to search for
        //are the required parameters to make a request using the By Search endpoint
        params: {
            apikey: '44e448f2',
            s: searchTerm
        }
    });

    if(response.data.Error){
        return ""; //for now, return an empty string when no results are found or too many results 
    }
    //return the data form the response that is relevant to this application
    //Search is a property inside of the response object that is an array of objects that contain information about the search results
    return response.data.Search;
};

//a function that can be called on user input
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = async (e) => {
    //store whatever returns from fetchData to a variable, using await because fetchData is async
    const movies = await fetchData(e.target.value);

    //iterate over the list of movies that came back from the request
    for(let movie of movies) {
        //for every movie that was fetched, create a div element that sumarizes the movie (poster image and string with title + year)
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}"/>
            <h1>${movie.Title} (${movie.Year})</h1>
        `;
        //append this new div to the document
        document.querySelector('#temp').appendChild(div);
    }
};

//select the search input and add the event listener
const input = document.querySelector('input');
//wrap the onInput function into the debounce helper function, with a delay of 500 miliseconds
input.addEventListener('input', debounce(onInput, 500));


