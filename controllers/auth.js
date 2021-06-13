const User=require('../models/user');

exports.getLogin = (req, res, next) => {
  //const isLoggedIn=req.get('Cookie').split(';')[0].trim().split('=')[1]
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
   console.log('post login called')
   
   User.findById('60c4751c3808bf29631e8dae')
   .then(user => {
     
     req.session.user = user;
     req.session.isLoggedIn=true;
     req.session.save(err=>{
      console.log(err);
      res.redirect('/');
     })
     
   })
   .catch(err => console.log(err));
    
  };
  exports.postLogout= (req, res, next) => {
    req.session.destroy(err=>{
      console.log(err);
      res.redirect('/');
    })
     
   };