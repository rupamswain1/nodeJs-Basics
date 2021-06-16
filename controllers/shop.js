const Product = require('../models/product');
const Order = require('../models/order');
const fs=require('fs');
const path=require('path');
const PDFDocument=require('pdfkit');

const stripe = require('stripe')('sk_test_43SsF03laS0J8GELXCkrLySI00j34NQlzP');
const ITEMS_PER_PAGE=2;

exports.getProducts = (req, res, next) => {
  let page=req.query.page;
  console.log(page);
  let currPage;
  if(!page){
    page=1;
  }
  if(page<1){
      currPage=1;
  }
  else{
    currPage=page
  }
  Product.find()
  .count()
  .then(numProducts=>{
    totalProducts=numProducts;
    return Product.find()
    .skip((currPage-1)*ITEMS_PER_PAGE)
    .limit(ITEMS_PER_PAGE)
  })
    .then(products => {
      console.log(products);
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        totalProducts:totalProducts,
        hasNextPage:ITEMS_PER_PAGE*page<totalProducts,
        hasPreviousPage:page>1,
        nextPage:parseInt(page)+1,
        previousPage:currPage-1,
        lastPage:Math.ceil(totalProducts/ITEMS_PER_PAGE),
        currentPage:parseInt(page)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
let totalProducts;
exports.getIndex = (req, res, next) => {
  let page=req.query.page;
  console.log(page);
  let currPage;
  if(!page){
    page=1;
  }
  if(page<1){
      currPage=1;
  }
  else{
    currPage=page
  }
  
  Product.find()
    .count()
    .then(numProducts=>{
        totalProducts=numProducts;
        return Product.find()
        .skip((currPage-1)*ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE)
    })
    .then(products => {
      console.log(totalProducts,ITEMS_PER_PAGE*page<totalProducts,page>1, parseInt(page)+1,Math.ceil(totalProducts/ITEMS_PER_PAGE))
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalProducts:totalProducts,
        hasNextPage:ITEMS_PER_PAGE*page<totalProducts,
        hasPreviousPage:page>1,
        nextPage:parseInt(page)+1,
        previousPage:currPage-1,
        lastPage:Math.ceil(totalProducts/ITEMS_PER_PAGE),
        currentPage:parseInt(page)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckout = (req, res, next) => {
  let products;
  let total = 0;
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      products = user.cart.items;
      total = 0;
      products.forEach(p => {
        total += p.quantity * p.productId.price;
      });

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: products.map(p => {
          return {
            name: p.productId.title,
            description: p.productId.description,
            amount: p.productId.price * 100,
            currency: 'usd',
            quantity: p.quantity
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success', // => http://localhost:3000
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel'
      });
    })
    .then(session => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: products,
        totalSum: total,
        sessionId: session.id
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCheckoutSuccess = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
    .then(result => {
      console.log(result);
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then(result => {
      res.redirect('/cart');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then(orders => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice=(req,res,next)=>{
  const orderId=req.params.orderId;
  Order.findById(orderId)
  .then(order=>{
    if(!order){
       return next(new Error('No Order found'))
    }
    if(order.user.userId.toString()!==req.user._id.toString()){
      return next(new Error('unautorized'))
    }

    const invoice='invoice-'+orderId+'.pdf';
    const invoicePath=path.join('data','invoices',invoice)

    const pdfDoc=new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.text(`Order Id: ${orderId}`)
    pdfDoc.end();
    const file=fs.createReadStream(invoicePath);
    res.setHeader('Content-Type','application/pdf')
    res.setHeader('Content-Disposition','inline; filename="'+invoice+'"');
    file.pipe(res);
  })
  .catch(err=>console.log(err))
  
   //fs.readFile(invoicePath,(err,data)=>{
  //   if(err){
  //     return next(err);
  //   }
  //   res.setHeader('Content-Type','application/pdf')
  //   res.setHeader('Content-Disposition','inline; filename="'+invoice+'"');
  //   res.send(data);
  // })
 
}