//Exports HTML that generates an user-facing list of the exisiting products
//it reuses the layout created for the user facing part of the app
const layout = require('../layout');

//template function that is called with a list of all the exisiting products
module.exports = ({ products }) => {
    //build up the list of products and the HTML for each of them
    //map over the list of products and for every product generate and return a snippet of HTML
    //returns an array of HTML snippets
    const renderedProducts = products.map((product) => {
      //code that will be invoked for every individual element (product) inside of the products array
      return `
      <div class="column is-one-quarter">
          <div class="card product-card">
            <figure>
              <img src="data:image/png;base64, ${product.image}"/>
            </figure>
            <div class="card-content">
              <h3 class="subtitle">${product.productName}</h3>
              <h5>$${product.price}</h5>
            </div>
            <footer class="card-footer">
              <form action="/cart/products" method="POST">
                <button class="button has-icon is-inverted">
                  <i class="fa fa-shopping-cart"></i> Add to cart
                </button>
              </form>
            </footer>
          </div>
        </div>
    `;
    //join the elements of the array containing HTML snippets into one string
    }).join('');

    return layout({
        content: `
          <section class="banner">
            <div class="container">
              <div class="columns is-centered">
                <img src="/images/banner.jpg" />
              </div>
            </div>
          </section>
          
          <section>
            <div class="container">
              <div class="columns">
                <div class="column "></div>
                <div class="column is-four-fifths">
                  <div>
                    <h2 class="title text-center">Featured Items</h2>
                    <div class="columns products">
                      ${renderedProducts}  
                    </div>
                  </div>
                </div>
                <div class="column "></div>
              </div>
            </div>
          </section>
        `
      });
}