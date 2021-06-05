const path=require('path');
const express=require('express');
const routes=express.Router();

const rootDir=require('../utils/path')

const products=[];

routes.use('/add-product',(req,res,next)=>{
    //res.send('<form method="POST" action="/admin/product"><input type="text" name="title"/><button type="submit">Add Product</button></form>')
    res.sendFile(path.join(rootDir,'views','add-products.html'))
})
//app.get is similar to app.use, only difference is, it is executes only for get request
routes.get('/product',(req,res,next)=>{ 
    res.send('<h1>Get request on page</h1>')
    
    res.redirect('/');
});
//app.get is similar to app.use, only difference is, it is executes only for post request
routes.post('/product',(req,res,next)=>{ 
    //res.send('<h1>Post request on page</h1>')
    //console.log(req.body)
    products.push({'title':req.body.title});
    res.redirect('/'); 
}); 

exports.routes=routes;
exports.products=products; 