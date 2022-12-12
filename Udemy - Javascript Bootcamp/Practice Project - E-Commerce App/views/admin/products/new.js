//Exports HTML that generates new product form
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

//get access to helper functions file and destruct out the getError method
//helper function to get potential errors in new product form validation
const { getError } = require('../../helpers.js');

module.exports = ({ errors }) => {
  //pass the content of the new product page to layout
  return layout({
    content: `
      <form method="POST" enctype="multipart/form-data">
        <input placeholder="Product name" name="productName" />
        ${getError(errors, 'productName')}
        <input placeholder="Price" name="price" />
        ${getError(errors, 'price')}
        <input type="file" name="image" />
        <button>Create</button
      </form>
    `
  });
};