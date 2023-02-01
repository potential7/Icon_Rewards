const express = require('express');
const authController = require("../controllers/auth")
const adminController = require("../controllers/admin")

const router = express.Router();

router.get('/signin',authController.signinView );
router.get('/signup',authController.signupView );
router.post('/signin',authController.login );
router.post('/signup',authController.signup );
router.get('/',authController.home );
router.get('/admin',adminController.signinView );
router.post('/admin',adminController.login );
router.get('/about',(req,res)=>{
    res.render('about',{
        pageTitle: "about"
    })
} );
router.get('/logout',(req, res) =>{
    req.session.destroy(() =>{
    res.redirect('/')
    })
    })

module.exports = router;