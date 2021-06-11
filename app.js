const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose=require('mongoose');

const errorController = require('./controllers/error');
//const mongoConnect = require('./util/database');
 //const User=require('./models/user');
// const Product=require('./models/product');
// const Cart=require('./models/cart');
// const CartItems=require('./models/cartItem');
const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req,res,next)=>{
    // User.findById('60c0f84636506c7a30e86d68')
    // .then(user=>{
    //     req.user=new User(user.username,user.email,user.cart, user._id);
    //     next();
    // })
    // .catch(err=>{console.log(err)})
    next();
   })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/admin', adminRoutes);
//app.use(shopRoutes);

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
    app.listen(8000);
})
.catch(err=>console.log(err)) 
