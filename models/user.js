const mongoDb=require('mongodb');
const getDb=require('../util/database').getDb;

class Users{
    constructor(username,email,cart,id){
        this.username=username;
        this.email=email;
        this.cart=cart;
        this._id=id;
    }

    save(){
        return getDb.collection('users').insertOne(this);
    }

    addToCart(product){
        const cartProductindex=this.cart.items.findIndex(cp=>{
            console.log("------------------------------------------------")
            console.log(cp)
            return cp.productId.toString()===product._id.toString();
        });
        let newQuantity=1;
        const updatedCartItem=[...this.cart.items];
        if(cartProductindex>=0){
            newQuantity=this.cart.items[cartProductindex].quantity+1;
            updatedCartItem[cartProductindex].quantity=newQuantity;
        }
        else{
            updatedCartItem.push({
                productId:new mongoDb.ObjectId(product._id),

                quantity:newQuantity
            });  
        }
        const updatedCart={items:updatedCartItem};
        const db=getDb();
        return db.collection('users').updateOne(
            {_id:new mongoDb.ObjectId(this._id)},
            {$set:{cart:updatedCart}}
        )
        .catch(err =>console.log(err)) 

    }

    getCart(){
        const db=getDb();
        const productIds=this.cart.items.map(i=>{
            return i.productId;
        });
        return db
        .collection('products')
        .find({_id:{$in:productIds}})
        .toArray()
        .then(products=>{
            return products.map(p=>{
                return{...p,quantity: this.cart.items.find(i=>{
                    return i.productId.toString()===p._id.toString();
                }).quantity};
            })
            
        })
       
    }

    deleteItemsFromCart(productId){
        //console.log(productId)
        const updatedCartItem=this.cart.items.filter(item=>{
            //console.log(item.productId.toString,productId.toString())
            return item.productId.toString()!==productId.toString()
        } );
        console.log(updatedCartItem);
        const db=getDb();
        return db.collection('users')
        .updateOne(
            {_id:new mongoDb.ObjectId(this._id)},
            {$set:{cart:{items:updatedCartItem}}}
        )
    }

    static findById(userId){
        const db=getDb();
        return db.collection('users').find({_id:mongoDb.ObjectId(userId)}).next();
    }
}

module.exports=Users;