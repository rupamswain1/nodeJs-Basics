
const Cart = require('./cart');
const db=require('../util/database')

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    db.execute('INSERT INTO Products (title,price,description,imageUrl) VALUES (?,?,?,?)',[this.title,this.price,this.description,this.imageUrl])
  }

  static deleteById(id) {
      }

  static fetchAll(cb) {
    return db.execute('SELECT * FROM Products')
     
  }

  static findById(id) {
        return db.execute('SELECT * FROM  Products where Products.id=?',[id])

      }
};
