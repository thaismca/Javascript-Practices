//----------CUSTOMIZE AUTOCOMPLETE-----------------------------------------------------------------------------------------------------------

//since we are going to have two instances of autocomplete that will share all configs except the dropdownRoot property,
//create an object to hold all the functions that are reusable between both instances
//these functions are
//searchRequest: function to make a HTTP request that returns a list of options to be displayed, according to the search term,
//or an error message, if no results return from the search (assigned to property searchError)
//renderOption: function that knows how to render an option in the dropdown
//setInputValue: function to set what information must be displayed in the input when an option is selected
const autocompleteConfig = {
    //function to make a HTTP request to the OMDb API By Search
    //must return either a list of results or an error message in the searchError property
    async searchRequest(searchTerm) {
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
        this.searchError = response.data.Error; //creates a property to hold info about error (no results are found or too many results)
        return; 
    }
    //return the data form the response that is relevant to this application
    //Search is a property inside of the response object that is an array of objects that contain information about the search results
    this.searchError = ''; //clear searchError from a previous search
    return response.data.Search;
},

    //function that returns a string containing HTML that renders a movie option containing a poster image, movie title and year
    renderOption(movie) {
        //some movies from the API don't have a link to the image in the Poster property, they have the string 'N/A' instead
        //handle so there are no broken references in our list if the movie doesn't actually have a poster
        const imgSrc = movie.Poster === 'N/A' ? "img/no-poster.jpg" : movie.Poster;

        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },

    //function to display the selected movie name and year inside of the input once an option is selected
    setInputValue(movie) {
        return `${movie.Title} (${movie.Year})`;
    }
};

//Each one of these function calls creates one of the autocomplete widgets using the template declared in autocomplete.js
//receiving the following parameters
//dropdownRoot: property that assigns the element where each specific dropdown will be inserted
//onOptionSelect: function that knows what should be done when a option is selected
//functions listed in autocompleteConfig that are reusable between this and more autocomplete widgets in the page
createAutocomplete({
    //property that defines the element that the autocomplete should be added to in the page
    dropdownRoot: document.querySelector("#left-autocomplete"),
    
    //function that renders the information about selected movie in the correct side of the screen
    async onOptionSelect(movie) {
        //hide tutorial
        document.querySelector('.tutorial').classList.add('is-hidden');
        //use helper function to make follow up request for movie details
        const movieDetail = await movieRequest(movie);
        //use helper function to create the HTML using the movie template and add this to the HTML document
        document.querySelector('#left-summary').innerHTML = movieTemplate(movieDetail);
    },
    
    //all reusable code in autocompleteConfig
    ...autocompleteConfig //this ... means make a copy of everything inside the autocompleteConfig object here 
});

createAutocomplete({
    //property that defines the element that the autocomplete should be added to in the page
    dropdownRoot: document.querySelector("#right-autocomplete"),

    //function that renders the information about selected movie in the correct side of the screen
    async onOptionSelect(movie) {
        //hide tutorial
        document.querySelector('.tutorial').classList.add('is-hidden');
        //use helper function to make follow up request for movie details
        const movieDetail = await movieRequest(movie);
        //use helper function to create the HTML using the movie template and add this to the HTML document
        document.querySelector('#right-summary').innerHTML = movieTemplate(movieDetail);
    },

    //all reusable code in autocompleteConfig
    ...autocompleteConfig //this ... means make a copy of everything inside the autocompleteConfig object here 
});

//----------HELPER FUNCTIONS-----------------------------------------------------------------------------------------------------------------
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
          <p class="subtitle">IMDB Rating</p>
        </article>
        <article class="notification is-primary">
          <p class="title">${movieDetail.imdbVotes}</p>
          <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}