//Exports HTML that generates page with confirmation of the purchase
//it reuses the layout created for the user facing part of the app
const layout = require('../layout');

//template function that is called with a list of all the exisiting items in the shopping cart
module.exports = ({ items }) => {
    //generating the HTML for the list of purchased items
    //build up the list of items and the HTML for each of them
    //map over the products in the list of items, and for every product generate and return a snippet of HTML
    //returns an array of HTML snippets
    renderedItems = items.map((item) => {
      //code that will be invoked for every individual element (item) inside of the items array
      return `
      <div class="cart-item message">
            <h3 class="subtitle">${item.product.productName}</h3>
            <div class="cart-right">
              <div>
                $${item.product.price}  X  ${item.quantity} = 
              </div>
              <div class="price is-size-4">
                $${item.product.price * item.quantity}
              </div>
            </div>
          </div>
    `;
    //join the elements of the array containing HTML snippets into one string
    }).join('');

    //calculating cart total
    const totalPrice = items.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
    }, 0);
    
    //pass the content of the purchase confirmation page to layout
    return layout({
        content: `
        <div id="cart" class="container">
          <div class="columns">
              <div class="column"></div>
              <div id="purchase-summary" class="column is-three-fifths">
                <div class="notification is-primary">
                  Thank you for shopping with us!
                </div>
                <div class="card">
                  <header class="card-header">
                    <p class="card-header-title">Your items</p>
                  </header>
                  <div class="card-content">
                    <div class="content">
                      ${renderedItems}
                    </div>
                  </div>
                </div>
                <div class="total message is-info">
                  <div class="message-header">
                    Total
                  </div>
                  <h1 class="title">$${totalPrice}</h1>
                </div>
              </div>
              <div class="column"></div>
            </div>
          </div>
        `
      });
}