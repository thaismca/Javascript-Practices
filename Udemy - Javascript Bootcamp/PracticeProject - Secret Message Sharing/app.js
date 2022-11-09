//handling form submission
document.querySelector('form').addEventListener('submit', (e) => {
    //prevent the form submission to a backend server
    e.preventDefault();

    //get a reference to the input where the message is typed
    const input = document.querySelector('input');
    //use btoa() to encode the message
    const encoded = btoa(input.value);

    console.log(`Message: ${input.value}`);
    console.log(`Encoded: ${encoded}`);
    
});