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
        // const cartProduct=this.cart.items.findIndex(cp=>{
        //     cp.id===product.___id
        // });
        console.log('****************************************************************************************************************************************',this._id)
        const updatedCart={items:[{...product,quantity:1}]};
        const db=getDb();
        return db.collection('users').updateOne(
            {_id:new mongoDb.ObjectId(this._id)},
            {$set:{cart:updatedCart}}
        )
        .catch(err =>console.log(err)) 

    }

    static findById(userId){
        const db=getDb();
        return db.collection('users').find({_id:mongoDb.ObjectId(userId)}).next();
    }
}

module.exports=Users;