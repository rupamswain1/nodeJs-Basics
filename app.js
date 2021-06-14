const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session=require('express-session');
const mongoDBStore=require('connect-mongodb-session')(session);

const mongoDBConnectionString='mongodb+srv://rupam123:rupam123@nodecluster.plaky.mongodb.net/shop?retryWrites=true&w=majority';

const store=new mongoDBStore({
  uri:mongoDBConnectionString,
  collection:'session',
})

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');



const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({secret:'my secret',resave:false, saveUninitialized:false,store:store}));

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    mongoDBConnectionString)
  .then(result => {
  
    app.listen(8000);
  })
  .catch(err => {
    console.log(err);
  });
