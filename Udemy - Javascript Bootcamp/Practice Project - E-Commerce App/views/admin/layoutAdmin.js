//layout that is customized for the administration panel of the application
//the goal here is to have a reuse of the HTML structure that can be shared across all pages in the admin panel

//this layout receives a string with all the HTML that is supposed to be added inside of the body tag
module.exports = ({ content }) => {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>E-Commerce - Admin Panel</title>
        </head>
        <body>
            ${content}
        </body>
        </html>
    `;
};

