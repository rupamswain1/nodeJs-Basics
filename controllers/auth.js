const User=require('../models/user');
const bcrypt=require('bcryptjs')
const {validationResult}=require('express-validator/check')

exports.getLogin = (req, res, next) => {
  //const isLoggedIn=req.get('Cookie').split(';')[0].trim().split('=')[1]
  let message=req.flash('message');
  if(message.length>0){
      message=message[0];
  }
  else{
    message=null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage:message
  });
};
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage:null,
    oldInput:{email:"", password:"", confirmPassword:""},
    validationErrors:[]
  });
};
exports.postLogin = (req, res, next) => {
   const email=req.body.email;
   const password=req.body.password;
   User.findOne({email:email})
   .then(user=>{
     if(!user){
       req.flash('error','Invalid email or password')
       res.redirect('/login');
     }
     else{
       return bcrypt.compare(password,user.password)
       .then(doMatch=>{
        if(doMatch){
           req.session.user = user;
           req.session.isLoggedIn=true;
           req.session.save(err=>{
           console.log(err);
           res.redirect('/');
        })
       }
       else{
         res.redirect('/login');
       }
      })
     }
   })
   .catch(err => console.log(err));
    
  };
  exports.postSignup = (req, res, next) => {
    const email=req.body.email;
    const password=req.body.password;
    const confirmPassword=req.body.confirmPassword;
    const errors=validationResult(req);
    if(!errors.isEmpty()){
      console.log(errors.array());
      return res.status(422).render('auth/signup',{
        path:'/signup',
        pageTitle:'Signup',
        errorMessage:errors.array()[0].msg,
        oldInput:{email:email, password:password, confirmPassword:confirmPassword},
        validationErrors:errors.array()
      },
      )
    }
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
          req.flash('error','User already exist, please use another email');
          res.redirect('/');
        }
        else{
          return bcrypt.hash(password,12)
          .then(hashedPassord=>{
            const user=new User({
              email:email,
              password: hashedPassord,
              cart:{items:[]},
            });
            return user.save();
        })
        .then(result=>{
          res.redirect('/login');
        })
          
        }
    })
    .catch(err => console.log(err));
    const user=new User()
  };
  exports.postLogout= (req, res, next) => {
    req.session.destroy(err=>{
      console.log(err);
      res.redirect('/');
    })
     
   };