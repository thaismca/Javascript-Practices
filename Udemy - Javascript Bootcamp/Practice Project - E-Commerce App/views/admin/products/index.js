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
      <div>${product.productName}</div>
    `;
  //join the elements of the array containing HTML snippets into one string
  }).join('');
  
  //pass the content of the list of products page to layout
  return layout({
    content: `
      <h1 class="title">Products</h1>
      ${renderedProducts}
    `
  });
};