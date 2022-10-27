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

//moving the generation of HTML following the required structure for a dropdown using bulma to the js file
//this allows a more independent code for a more reusable widget, that can be applied to any HTML file
//requiring only one div existing in the HTML document where this HTML can be added to work, not the entire structure
//in this case, this one existing div in the HTML document must have an "autocomplete" class applied to it
const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <label>Search for a movie</label>
    <input class="input" />
    <div class="dropdown">
        <div class="dropdown-menu">
          <div class="dropdown-content results">
          </div>
        </div>
      </div>
`;

//select the elements from the autocomplete that we are going to need to work with 
const input = document.querySelector('.input');
const dropdown = document.querySelector('.dropdown');
const resultsWrapper = document.querySelector('.dropdown-content');


//a function that can be called on user input
//assign the function to a variable that will be passed as the second argument in the input EventListener
const onInput = async (e) => {
    //store whatever returns from fetchData to a variable, using await because fetchData is async
    const movies = await fetchData(e.target.value);

    //make the dropdown visible by adding class is-active (from Bulma structure) to the element selected and stored in the const dropdown
    dropdown.classList.add('is-active');

    //iterate over the list of movies that came back from the request
    for(let movie of movies) {
        //for every movie that was fetched, create a anchor tag element that sumarizes the movie (poster image and string with title + year)
        //this tag must have the dropdown-item class applied for styling purposes (from Bulma structure)
        const listOption = document.createElement('a');
        listOption.classList.add('dropdown-item');
        listOption.innerHTML = `
            <img src="${movie.Poster}"/>
            ${movie.Title} (${movie.Year})
        `;
        //append this new anchor tag that represents a list option that can be selected in the dropdown to the resultsWrapper
        resultsWrapper.appendChild(listOption);
    }
};

//add the event listener to the selected input
//wrap the onInput function into the debounce helper function, with a delay of 500 miliseconds
input.addEventListener('input', debounce(onInput, 500));


