const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose=require('mongoose');

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database');
 const User=require('./models/user');
// const Product=require('./models/product');
// const Cart=require('./models/cart');
// const CartItems=require('./models/cartItem');
const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req,res,next)=>{
    User.findById('60c4751c3808bf29631e8dae')
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{console.log(err)})
    //next();
   })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// app.use(errorController.get404);
// Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
// User.hasMany(Product);
// Cart.belongsTo(User);
// User.hasOne(Cart);
// Cart.belongsToMany(Product,{through:CartItems});
// Product.belongsToMany(Cart,{through:CartItems});

mongoose.connect("mongodb+srv://rupam123:rupam123@nodecluster.plaky.mongodb.net/shop?retryWrites=true&w=majority")
.then(result=>{
    console.log('connected')
    User.findOne()
    .then(user=>{
        if(!user){
            const user=new User({
                name:'rupam',
                email:'abc@pqr.com',
                cart:{
                    items:[]
                }
            })
            user.save();
        }
    })
    
    app.listen(8000);
})
.catch(err=>console.log(err)) 
