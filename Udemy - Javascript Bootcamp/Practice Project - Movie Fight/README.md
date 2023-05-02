
# Practice Project - Movie Fight

This projects implements a web aplication where a user can type the name of a movie in one of the search bars to see the movie stats pulled from omdbapi.com, and then search for a second movie in the other search bar, to have the stats compared.

![movie fight with comparison results - screenshot](https://github.com/thaismca/Javascript-Practices/blob/5870cdd2684dcffba0298b9f760c9ed13cfd4ba0/Udemy%20-%20Javascript%20Bootcamp/Practice%20Project%20-%20Movie%20Fight/screenshots/movie-fight-result.PNG?raw=true)

### Challenges:
**1 - Fetch data about movies**

Free API for getting movie data: omdbapi.com

First, it's necessary to do a search to find some records that match the user search term, and then a follow up request to get information about a particular movie that the user selected. This means both available endpoints in the API are used.

**By Search:** to list movies in the autocomplete widget that matches whatever the user types in the search input.

API limitation: if you type only some part of a word that exists in the movie's title, it won't work. User needs to type an entire word in order to fetch valid data. For instance, typing "aveng" won't bring any results, but typing "avenger" (singular) will bring movies that contain this exact word, and typing "avengers" plural will bring other movies that contain this other string.

**By ID:** to get more details about the movie that the user selects from th list of options in the autocomplete widget.

**2 - Build autocomplete widget from scratch**
- Input where user can type a string to search for a movie title.
- As soon as the user enters in some kind of full string and stops typing, that search string is used to make a search request off to the API, and get back some list of results.
- Then, all those search results are taken, and a little menu underneath that input opens to render out all the possible movies that the user might be looking for.
- Each item in the list is comprised of the movie poster, movie title and movie year.
- If the search returns no result, the menu i entirely closed.
- Since the user will be requested to click on a movie in the list to select it, pressing enter when entrying data in the search input does nothing.
- When an entry in the list of movies is selected by the user, the text in the search input is updated to match the selected movie title, and the menu is closed.
- If user clicks outside of the dropdown menu at any point, the menu is closed and nothing else happens.
 
## Project structure

To make the autocomplete feature more reusable and beter organize the code, this project works with two different js files:

### app.js

Non-reusable code for our very specific project
Config for autocomplete (to customize autocomplete)
- root: element that the autocomplete should be rendered into
- searchRequest(): function to make a HTTP request that returns a list of options to be displayed, according to the search term, or an error message, if no results return from the search
- renderOption(): function that knows how to render a movie option in the dropdown
- onOptionSelect(): function that knows what to do when a movie option is selected
- setInputValue(): function that knows what to display in the input when a movie option is selected
- requestMovie(): function that makes a follow up request when a movie is clicked
- movieTemplate(): function that generates and returns the HTML structure for a movie

### autocomplete.js

Super reusable code to get an autocomplete to work. 

- Zero knowledge about 'movies', so it can be used for different objects (like recipes, blog posts, etc.)
- Must be able to be ran several times in the same project.
- Function that will take the autocomplete config and render an autocomplete on the screen.
