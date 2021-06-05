const path=require('path')

const express=require('express');
const routes=express.Router();

const appData=require('./admin')

routes.get('/',(req,res,next)=>{
    console.log(appData.products)
    res.sendFile(path.join(__dirname,'../','views',"shop.html"))
});

module.exports=routes; 