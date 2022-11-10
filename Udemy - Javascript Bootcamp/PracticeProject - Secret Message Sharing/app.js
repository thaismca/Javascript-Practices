//create references to relevant elements in the page
const messageForm = document.querySelector('#message-form');
const linkForm = document.querySelector('#link-form');
const messageDisplay = document.querySelector("#message-display");

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


//handling message form submission
document.querySelector('form').addEventListener('submit', (e) => {
    //prevent the form submission to a backend server
    e.preventDefault();

    //toggle elements visibility
    messageForm.classList.add('hide');
    linkForm.classList.remove('hide');

    //get a reference to the input where the message is typed
    const messageInput = document.querySelector('#message-input');
    //use btoa() to encode the message
    const encoded = btoa(messageInput.value);

    //get a reference for the input where the link is displayed
    const linkInput = document.querySelector('#link-input');
    //set its value a string formed by the current window.location + the encoded string as the hash part of the URL
    linkInput.value = `${window.location}#${encoded}`;
    //automatically select the text so the user can easily copy it to the clipboard
    linkInput.select();
});