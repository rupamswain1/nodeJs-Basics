const http=require('http');

const express=require('express');

const app=express();

const path=require('path');
const bodyParser = require('body-parser');
app.use(express.static(path.join(__dirname, 'public')));



const adminRouter=require('./routes/admin');
const shopRouter=require('./routes/shop');

app.use(bodyParser.urlencoded({extended:false}))

app.set('view engine','pug');
app.set('views','views')

app.use('/admin',adminRouter.routes);
app.use(shopRouter)

app.use((req,res,next)=>{
    res.status(404).sendFile(path.join(__dirname,'views','404.html'))
})


//const server=http.createServer(app);
//server.listen(8000);
app.listen(8000);