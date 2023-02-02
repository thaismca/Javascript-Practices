//test the ability to display an autocomplete widget in the page
it('Shows an autocomplete', () => {
    createAutoComplete({
        root: document.querySelector('#target'),
        fetchData() {
            //fake data for the sake of testing
            return [
                { Title: 'Avengers' },
                { Title: 'Harry Potter' },
                { Title: 'Star Wars' }
            ];
        },
        renderOption(movie) {
            return movie.Title;
        }
    });
})