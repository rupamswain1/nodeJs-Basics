const User=require('../models/user');
const bcrypt=require('bcryptjs')


exports.getLogin = (req, res, next) => {
  //const isLoggedIn=req.get('Cookie').split(';')[0].trim().split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};
exports.postLogin = (req, res, next) => {
   const email=req.body.email;
   const password=req.body.password;
   User.findOne({email:email})
   .then(user=>{
     if(!user){
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
    User.findOne({email:email})
    .then(userDoc=>{
        if(userDoc){
          console.log('user eixst');
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