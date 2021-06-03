const http=require('http');

const express=require('express');

const app=express();


const bodyParser = require('body-parser');


app.use(bodyParser.urlencoded({extended:false}))

app.use('/add-product',(req,res,next)=>{
    res.send('<form method="POST" action="/product"><input type="text" name="title"/><button type="submit">Add Product</button></form>')
})
//app.get is similar to app.use, only difference is, it is executes only for get request
app.get('/product',(req,res,next)=>{ 
    res.send('<h1>Get request on page</h1>')
    
    res.redirect('/');
});
//app.get is similar to app.use, only difference is, it is executes only for post request
app.post('/product',(req,res,next)=>{ 
    res.send('<h1>Post request on page</h1>')
    
    res.redirect('/');
});

app.use('/',(req,res,next)=>{
    res.send('<h1>Landing Page</h1>')
});


//const server=http.createServer(app);
//server.listen(8000);
app.listen(8000);