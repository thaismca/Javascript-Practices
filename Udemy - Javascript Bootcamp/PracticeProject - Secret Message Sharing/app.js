//create references to elements that will have visibility toggled in the page
const messageForm = document.querySelector('#message-form');
const linkForm = document.querySelector('#link-form');
const messageDisplay = document.querySelector("#message-display");

//----- DISPLAY DECODED MESSAGE ------------------------------------------------------------------------------------------------

//checking if the url that is being visited already contains a hash ->which means it carries an encoded message
const { hash } = window.location;
if(hash) {
    //toggle elements visibility
    messageForm.classList.add('hide');
    messageDisplay.classList.remove('hide');

    //decode the part of the hash that represents the encoded message (the hash without the # symbol)
    const decoded = atob(hash.replace('#', ''));
    //add the message to the document
    document.querySelector('#message-decoded').innerText = decoded;
}

//----- MESSAGE INPUT AND LINK GENERATION ---------------------------------------------------------------------------------------

//create a reference to the input where the message is typed
const messageInput = document.querySelector('#message-input');
//create a reference to the chars counter
const charsCounter = document.querySelector('#chars-counter');

//set a character limit for the message
const limit = 75;
messageInput.setAttribute('maxlength', limit);
//a variable to hold how many chars user can still type -> initialized with whatever the limit is
let charsLeft = limit;
charsCounter.innerText = `${charsLeft}/${limit}`

//handling characters counter
messageInput.addEventListener('input', (e) => {
    //update how many chars user can still type
    charsLeft = limit - messageInput.value.length;
    //display updated information
    charsCounter.innerText = `${charsLeft}/${limit}`
});

//handling message form submission
document.querySelector('form').addEventListener('submit', (e) => {
    //prevent the form submission to a backend server
    e.preventDefault();

    //get a reference to the input where the message is typed
    const messageInput = document.querySelector('#message-input');

    //display error message if message is empty
    if(messageInput.value === ''){
        M.toast({html: 'Enter a valid message!', displayLength: 1500, classes: 'red darken-1'})
        return;
    }

    //toggle elements visibility
    messageForm.classList.add('hide');
    linkForm.classList.remove('hide');

    //use btoa() to encode the message
    const encoded = btoa(messageInput.value);

    //get a reference for the input where the link is displayed
    const linkInput = document.querySelector('#link-input');
    //set its value a string formed by the current window.location + the encoded string as the hash part of the URL
    linkInput.value = `${window.location}#${encoded}`;
    //automatically select the text so the user can easily copy it to the clipboard
    linkInput.select();
});