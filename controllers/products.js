const rootDir = require('../util/path');

const Products=require('../models/Products');


exports.getAddProduct=(req, res, next) => {
    res.render('add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      formsCSS: true,
      productCSS: true,
      activeAddProduct: true
    });
  }

exports.postAddProducts=(req, res, next) => {
    const product=new Products(req.body.title)
    product.save();
    res.redirect('/');
  }

exports.getProducts=(req, res, next) => {
    Products.fetchAll(product=>{
      res.render('shop', {
        prods: product,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: product.length > 0,
        activeShop: true,
        productCSS: true
      });
    });
  }