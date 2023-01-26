//Exports HTML that generates a list of the exisiting products
//it reuses the layout created for the admin panel
const layout = require('../layoutAdmin.js');

//template function that is called with a list of all the exisiting products
module.exports = ({ products }) => {
  //build up the list of products and the HTML for each of them
  //map over the list of products and for every product generate and return a snippet of HTML
  //returns an array of HTML snippets
  const renderedProducts = products.map((product) => {
    //code that will be invoked for every individual element (product) inside of the products array
    return `
    <tr>
      <td>${product.productName}</td>
      <td>${product.price}</td>
      <td>
        <a href="/admin/products/${product.id}/edit">
          <button class="button is-link">
            Edit
          </button>
        </a>
      </td>
      <td>
        <form method="POST" action="/admin/products/${product.id}/delete">
          <button class="button is-danger">Delete</button>
        </form>  
      </td>
    </tr>
  `;
  //join the elements of the array containing HTML snippets into one string
  }).join('');
  
  //pass the content of the list of products page to layout
  return layout({
    content: `
    <div class="control">
      <h1 class="subtitle">Products</h1>  
      <a href="/admin/products/new" class="button is-primary">New Product</a>
    </div>
    <table class="table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Price</th>
          <th>Edit</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        ${renderedProducts}
      </tbody>
    </table>
  `
  });
};