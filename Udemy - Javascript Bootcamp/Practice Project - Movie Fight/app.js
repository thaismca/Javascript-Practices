createAutocomplete({
    //property that defines the element that the autocomplete should be added to in the page
    dropdownRoot: document.querySelector(".autocomplete-one"),
    
    //function that returns a string containing HTML that renders a movie option
    renderOption(movie) {
        //some movies from the API don't have a link to the image in the Poster property, they have the string 'N/A' instead
        //handle so there are no broken references in our list if the movie doesn't actually have a poster
        const imgSrc = movie.Poster === 'N/A' ? "img/no-poster.jpg" : movie.Poster;

        return `
            <img src="${imgSrc}" />
            ${movie.Title} (${movie.Year})
        `;
    },

    //function to be invoked when a option in the dropdown menu is select
    async onOptionSelect(movie) {
        //make follow up request for movie details
        const movieDetail = await movieRequest(movie);
        //use the helper function to create the HTML using the movie template and add this to the HTML document
        document.querySelector('#summary').innerHTML = movieTemplate(movieDetail);
    },

    //function to display the selected movie name and year inside of the input once an option is selected
    setInputValue(movie) {
        return `${movie.Title} (${movie.Year})`;
    }
})