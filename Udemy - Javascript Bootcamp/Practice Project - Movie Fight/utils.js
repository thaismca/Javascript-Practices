//---------- HELPER FUNCTIONS ---------------------------------------------------------------------------------------------------------------
//helper debounce function that receives a function in the arguments, to be used anywhere in the code where we want to introduce
//some rate limiting on how often this function can be invoked
//it also receives a delay argument, that represents the miliseconds to be passed in the setTimeout (default to 1000)
const debounce = (func, delay = 1000) => {
    //it will return a function that will implement a shield and guard how ofter func can actually be invoked
    //func might need to receive some arguments, so we need to make sure that if we ever pass any arguments to this wrapping function
    //they will be forward to func whenever it's called
    let timeoutId; //variable to keep track of the current timer identifier
    return (...args) => {
        //check if there is a timer from a previous input that is still pending
        if(timeoutId) {
            //if one is found, clearTimeout so func is never called
            clearTimeout(timeoutId);
        }
        //wait one second to run the function passed in the argument of debounce()
        //and assign the value that is returned from the setTimeout to the timeoutId variable
        timeoutId = setTimeout(() => {
            //call the function and take all the arguments or whatever is inside of the args array and pass them in
            //as separate arguments to the original function
            func.apply(null, args);
        }, delay);
    };
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//helper function to make a HTTP request to the OMDb API By Search
//it accepts a string searchTerm that will be past as the s argument expected by the API
const searchRequest = async (searchTerm) => {
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
        return response.data; //return the response data if there's an Error property (no results are found or too many results) 
    }
    //return the data form the response that is relevant to this application
    //Search is a property inside of the response object that is an array of objects that contain information about the search results
    return response.data.Search;
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//helper function to make a follow up HTTP request to the OMDb API By ID
//it accepts a movie object that will have this imdbID property to be past as the i argument expected by the API
const movieRequest = async (movie) => {
    //axios.get can receive an object with parameters in the arguments, to create a query string that will be added to the request url
    const response = await axios.get('http://www.omdbapi.com/', {
        //according to the API documentation, the apikey and a string i corresponding to the movie IMDb ID
        //are the required parameters to make a request using the By ID endpoint
        params: {
            apikey: '44e448f2',
            i: movie.imdbID
        }
    });
    //return the data form the response that is relevant to this application
    //Search is a property inside of the response object that is an array of objects that contain information about the search results
    return response.data;
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//helper to render the HTML that displays a movie details, using classes from bulma to style how information is displayed
const movieTemplate = (movieDetail) => {
    return `
        <!--movie summary-->
        <article class="media">
          <figure class="media-left">
            <p class="image">
              <img src="${movieDetail.Poster}" />
            </p>
          </figure>
          <div class="media-content">
            <div class="content">
              <h1>${movieDetail.Title}</h1>
              <h4>${movieDetail.Genre}</h4>
              <p>${movieDetail.Plot}</p>
            </div>
          </div>
        </article>

        <!--movie stats-->
        <article class="notification is-primary">
          <p class="title">${movieDetail.Awards}</p>
          <p class="subtitle">Awards</p>
        </article>
        <article class="notification is-primary">
          <p class="title">${movieDetail.BoxOffice}</p>
          <p class="subtitle">Box Office</p>
        </article>
        <article class="notification is-primary">
          <p class="title">${movieDetail.Metascore}</p>
          <p class="subtitle">Metascore</p>
        </article>
        <article class="notification is-primary">
          <p class="title">${movieDetail.imdbRating}</p>
          <p class="subtitle">IMDb Rating</p>
        </article>
        <article class="notification is-primary">
          <p class="title">${movieDetail.imdbVotes}</p>
          <p class="subtitle">IMDb Votes</p>
        </article>
    `;
}
