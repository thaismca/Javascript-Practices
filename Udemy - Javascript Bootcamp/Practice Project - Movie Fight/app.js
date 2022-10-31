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
        //use helper function to make follow up request for movie details and display stats in the left-summary
        movieRequest(movie, document.querySelector('#left-summary'), 'left');
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
        //use helper function to make follow up request for movie details and display stats in the right-summary
        movieRequest(movie, document.querySelector('#right-summary'), 'right');
    },
    //all reusable code in autocompleteConfig
    ...autocompleteConfig //this ... means make a copy of everything inside the autocompleteConfig object here 
});



//----------HELPER FUNCTIONS-----------------------------------------------------------------------------------------------------------------
//helper function to make a follow up HTTP request to the OMDb API By ID
//it accepts a movie object that will have this imdbID property to be past as the i argument expected by the API
//it also receives a string indicating the autocomplete where the request comes from (left or right)
let leftMovie;
let rightMovie;
const movieRequest = async (movie, summaryElement, side) => {
    //axios.get can receive an object with parameters in the arguments, to create a query string that will be added to the request url
    const response = await axios.get('http://www.omdbapi.com/', {
        //according to the API documentation, the apikey and a string i corresponding to the movie IMDb ID
        //are the required parameters to make a request using the By ID endpoint
        params: {
            apikey: '44e448f2',
            i: movie.imdbID
        }
    });

    //use helper function to create the HTML using the movie template and add this to the HTML document in the summaryElement
    summaryElement.innerHTML = movieTemplate(response.data);

    //check the side where the request came from and update the corresponding variable
    if(side === 'left'){
        leftMovie = response.data;
    } else {
        rightMovie = response.data;
    }
    //check if there are movies selected for both left and right sides, and do the comparison only if both are selected
    if(leftMovie && rightMovie){
        //invoke helper function that handles the comparison
        runComparison();
    }
};
//--------------------------------------------------------------------------------------------------------------------------------------------
//helper to handle the comparison between the two selected movies
const runComparison = () => {
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    console.log(leftSideStats);
    console.log(rightSideStats)

    //loop over the leftStats
    leftSideStats.forEach((leftStat, index) => {
        //get corresponding right stat into a variable by using the current leftSideStat index
        const rightStat = rightSideStats[index];
        //get the actual value property of the current stat at each side
        const leftSideValue = parseFloat(leftStat.dataset.value);
        const rightSideValue = parseFloat(rightStat.dataset.value);
        //compare current stat value in both sides, and apply .is-warning to and remove .is primary from the lowest
        if(rightSideValue > leftSideValue) { //right side with better stat
            leftStat.classList.remove('is-primary');
            leftStat.classList.add('is-warning');

            rightStat.classList.add('is-primary');
            rightStat.classList.remove('is-warning');

        } else if (rightSideValue < leftSideValue) { //left side with better stat
            leftStat.classList.add('is-primary');
            leftStat.classList.remove('is-warning');

            rightStat.classList.remove('is-primary');
            rightStat.classList.add('is-warning');
        } else { //right and left sides are equal, both should be yellow
            leftStat.classList.remove('is-primary');
            leftStat.classList.remove('is-warning');

            rightStat.classList.remove('is-primary');
            rightStat.classList.remove('is-warning');
        }
    });
}
//--------------------------------------------------------------------------------------------------------------------------------------------
//helper to render the HTML that displays a movie details, using classes from bulma to style how information is displayed
const movieTemplate = (movieDetail) => {
    //get number representations of the data displayed in the stats, so a comparison can run in the future

    //awards (will considerer whatever movie with bigger number in total, considering either wins or nominations)
    let awards;
    //first check if awards data thata come from the API is not undefined (set awards to 0 if that's the case)
    if (!movieDetail.Awards) {
        awards = 0;
    } else {
        //get an array containing each word of the string in one of the array's position (split on ' ')
        //iterate over the array and add all valid numbers
        awards = movieDetail.Awards.split(' ').reduce((prev, word) => {
            //try and get a number from the word
            const value = parseInt(word);
            
            if(isNaN(value)){
                //if not a valid number (isNaN), just return whatever there is in the prev accumulator
               return prev;
            }
            else {
                //if a valid number is obtained from parsing the word, add to the prev accumulator and return the sum
                return  prev + value;
            }
        }, 0); 

    } 
    
    //box office amount
    //remove $ and , , from string and extract an integer only -> replace then with '' -> parse what's left into an integer
    //but first check if box office data that comes from the API is not undefined (set box office to 0 if that's the case)
    let boxOffice = (!movieDetail.BoxOffice) ? 0 : parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    //check if it's an invalid number and consider it 0 if that's the case
    //(covers when box office is 'N/A' or other string indicading absence of data)
    if(!boxOffice){
        boxOffice = 0; //no box office valid data, then it should be considered 0
    } 
    
    //metascore - parse into an int
    //but first check if metascore data that comes from the API is not undefined (set metascore to 0 if that's the case)
    let metascore = (!movieDetail.Metascore) ? 0 : parseInt(movieDetail.Metascore);
    //check if it's an invalid number and consider it 0 if that's the case
    //(covers when metascore is 'N/A' or other string indicading absence of data)
    if(!metascore){
        metascore = 0; //no valid metascore, then it should be considered 0
    }

    //IMDb Rating - parse into a float
    //but first check if rating data that comes from the API is not undefined (set IMDb rating to 0 if that's the case)
    let imdbRating = (!movieDetail.imdbRating) ? 0 : parseFloat(movieDetail.imdbRating);
    //check if it's an invalid number and consider it 0 if that's the case
    //(covers when IMDb rating is 'N/A' or other string indicading absence of data)
    if(!imdbRating){
        imdbRating = 0; //no valid IMDb Rating, then it should be considered 0
    }

    //IMDb Votes - parse into a int
    //but first check if votes data that comes from the API is not undefined (set IMDb votes to 0 if that's the case)
    let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
    //check if it's an invalid number and consider it 0 if that's the case
    //(covers when IMDb votes is 'N/A' or other string indicading absence of data)
    if(!imdbVotes){
        imdbVotes = 0; //no valid IMDb votes, then it should be considered 0
    }

    //movie poster
    //check if there is no poster for the selected movie and use the image no-poster,jpg if that's the case
    const imgSrc = movieDetail.Poster === 'N/A' ? "img/no-poster.jpg" : movieDetail.Poster;

    return `
        <!--movie summary-->
        <article class="media">
          <figure class="media-left">
            <p class="image">
              <img src="${imgSrc}" />
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
        <article data-value=${awards} class="notification">
          <p class="title">${movieDetail.Awards}</p>
          <p class="subtitle">Awards</p>
        </article>
        <article data-value=${boxOffice} class="notification">
          <p class="title">${movieDetail.BoxOffice}</p>
          <p class="subtitle">Box Office</p>
        </article>
        <article data-value=${metascore} class="notification">
          <p class="title">${movieDetail.Metascore}</p>
          <p class="subtitle">Metascore</p>
        </article>
        <article data-value=${imdbRating} class="notification">
          <p class="title">${movieDetail.imdbRating}</p>
          <p class="subtitle">IMDB Rating</p>
        </article>
        <article data-value=${imdbVotes} class="notification">
          <p class="title">${movieDetail.imdbVotes}</p>
          <p class="subtitle">IMDB Votes</p>
        </article>
    `;
}