//Exports HTML that generates the list of products in a shopping cart
//it reuses the layout created for the user facing part of the app
const layout = require('../layout');

//template function that is called with a list of all the exisiting items in the shopping cart
module.exports = ({ items }) => {
    //generating the HTML for the list of items in the cart
    let renderedItems;
    //check if items array is empty
    if(items.length < 1) {
        //if no items in the list
        renderedItems = `
        <div class="cart-item message">
          <h3 class="subtitle">Your cart is empty</h3>
        </div>
        `
    }
    //if the items array is not empty
    else {
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
              <div class="remove">
                <form method="POST" action="/cart/products/remove">
                  <input hidden value="${item.id}" name="itemId" />
                  <button class="button is-danger">                  
                    <span class="icon is-small">
                      <i class="fas fa-times"></i>
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
      `;
      //join the elements of the array containing HTML snippets into one string
      }).join('');
    }

    //calculating cart total
    const totalPrice = items.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
    }, 0);
    
    //pass the content of the show cart page to layout
    return layout({
        content: `
        <div id="cart" class="container">
          <div class="columns">
            <div class="column"></div>
            <div class="column is-four-fifths">
              <h3 class="subtitle"><b>Shopping Cart</b></h3>
              <div>
                ${renderedItems}
              </div>
              <div class="total message is-info">
                <div class="message-header">
                  Total
                </div>
                <h1 class="title">$${totalPrice}</h1>
                <form method="POST" action="/cart/products/buy">
                  <button class="button is-primary">Buy</button>
                </form>
              </div>
            </div>
            <div class="column"></div>
          </div>
        </div>
        `
      });
}