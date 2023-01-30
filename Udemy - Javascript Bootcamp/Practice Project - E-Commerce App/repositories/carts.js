//require in the Repository class
const Repository = require('./repository');

class CartsRepository extends Repository {
  //function that retrieves user's cart or creates one if there's none
  async userCart(req) {
    //variable to hold a reference to the user's cart
    let cart;
    //check if there's is an existing cart for the user
    if(!req.session.cartId) {
      //no existing cart -> create one
      cart = await this.create({ items: [] });
      //get the id that was created for the cart and assign it to the req.session.cartId property
      req.session.cartId = cart.id;
    }
    //user already has a cartId associated in the session cookie
    else {
      //retrieve cart information from the repository
      cart = await this.getOne(req.session.cartId);

      //if carts.json file is corrupted and user's cart was accidentaly deleted from the repository file
      if(!cart) {
        cart = await this.create({ items: [] });
        //get the id that was generated for this new cart and overwrite req.session.cartId property
        req.session.cartId = cart.id;
      }
    }
    return cart; 
  }

  //function that associates a product from a Products Repository to all items in the user's cart
  async getProductsFromCart(req, productsRepo){
    //retrieve user's cart
    const cart = await this.userCart(req);

    //iterate through the items in the cart
    for(let item of cart.items) {
      //retrieve information about the product with the item id in the Products Repository
      const product = await productsRepo.getOne(item.id);
      //associate the product to the item
      item.product = product;
  }
  return cart;
}

}

//make an instance of this class available to other files inside of this project
module.exports = new CartsRepository('carts.json');