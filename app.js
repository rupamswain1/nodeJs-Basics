const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');
const User=require('./models/user');
const Product=require('./models/product');
const Cart=require('./models/cart');
const CartItems=require('./models/cartItem');
const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use((req,res,next)=>{
    User.findByPk(1)
    .then(user=>{
        req.user=user;
        next();
    })
    .catch(err=>{console.log(err)})
})

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);
Product.belongsTo(User,{constraints:true,onDelete:'CASCADE'});
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product,{through:CartItems});
Product.belongsToMany(Cart,{through:CartItems});

sequelize.sync()
.then(result=>{
    return User.findByPk(1);
})
.then(user=>{
    if(!user){
        return User.create({name:'rupam',email:'abc@pqr.com'});
    }
    return user;
})
.then(user=>{
    return user.createCart();
    //console.log(user);
    
})
.then(user=>{
    app.listen(8000);
});

