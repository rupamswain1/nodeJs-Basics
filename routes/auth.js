const express = require('express');

const authController = require('../controllers/auth');
const  {check,body}=require('express-validator/check');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);
router.post('/signup', [check('email').isEmail().withMessage('Invalid Email'),
body('password',
'Please enter a valid password with number and text and at least 5 character')
.isLength({min:5})
.isAlphanumeric(),
body('confirmPassword')
.custom((value,{req})=>{
    if(value!==req.body.password ){
        throw new Error('Password does not match');
    }
    return true;
})]
,authController.postSignup);
module.exports = router; 