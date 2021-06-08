const getDb=require('../util/database').getDb;
const mongoDb=require('mongodb');
class Product{
  constructor(title,price,description,imageUrl,id){
    this.title=title;
    this.price=price;
    this.description=description;
    this.imageUrl=imageUrl
    this._id=id
  }

  save(){
    const db =getDb();
    let dbOp;
    if(this._id){
      dbOp=db.collection('products')
      .updateOne({_id:new mongoDb.ObjectId(this._id)},{$set:{title:this.title,price:this.price,description:this.description,imageUrl:this.imageUrl}});
      console.log(this)
    }
    else{
      dbOp=db.collection('products').insertOne(this)
    }
    return dbOp
    .then(result=>console.log(result))
    .catch(err=>console.log(err));
  }

  static fetchAll(){
    const db=getDb();
    return db.collection('products')
    .find()
    .toArray()
    .then(products=>{
      console.log(products);
      return products;
    })
    .catch(err=>console.log(err))
  }

  static findById(prodId){
    const db=getDb();
    return db.collection('products')
    .find({_id:mongoDb.ObjectID(prodId)})
    .next()
    .then(product=>{
      console.log(product);
      return product;
    })
    .catch(err=>console.log(err));
  }

  static deleteById(prodId){
    const db=getDb();
    return db.collection('products')
    .deleteOne({_id:new mongoDb.ObjectId(prodId)})
    .then(product=>{
      console.log('Product Deleted')
      return product;
    })
    .catch(err=>console.log(err))
  }
};
module.exports=Product;