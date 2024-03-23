const BaseSQLModel = require("./baseSQLModel");

// Create a new class for a specific table
class WishModel extends BaseSQLModel {

  constructor() {
    super("cart"); //table 'wishlists'
  }

  async getUserWishlists(user_id){
    const results =  await this.findAllByKey('customer_id', customer_id);
    return results;
  }

}

const WishDB = new WishModel();

module.exports = WishDB;