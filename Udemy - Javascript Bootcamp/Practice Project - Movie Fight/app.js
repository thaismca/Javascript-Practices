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
    }
})