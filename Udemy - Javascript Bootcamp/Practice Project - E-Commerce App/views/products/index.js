//Exports HTML that generates an user-facing list of the exisiting products

//template function that is called with a list of all the exisiting products
module.exports = ({ products }) => {
    //build up the list of products and the HTML for each of them
    //map over the list of products and for every product generate and return a snippet of HTML
    //returns an array of HTML snippets
    const renderedProducts = products.map((product) => {
      //code that will be invoked for every individual element (product) inside of the products array
      return `
      <li>${product.productName} - ${product.price}</li>
    `;
    //join the elements of the array containing HTML snippets into one string
    }).join('');

    return `
    <ul>
      ${renderedProducts}
    </ul>
    `;
}