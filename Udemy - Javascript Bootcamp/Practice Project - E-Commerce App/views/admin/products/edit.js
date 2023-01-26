//Exports HTML that generates new product form
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

//get access to helper functions file and destruct out the getError method
//helper function to get potential errors in new product form validation
const { getError } = require('../../helpers.js');

module.exports = ({ product, errors }) => {
  //pass the content of the new product page to layout
  return layout({
    content: `
      <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Edit Product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Product Name" name="productName" value="${product.productName}">
              <p class="help is-danger">${getError(errors, 'productName')}</p>
            </div>
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price" value="${product.price}">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
            </div>
            <br />
            <button class="button is-primary">Save changes</button>
          </form>
        </div>
      </div>
    `
  });
};