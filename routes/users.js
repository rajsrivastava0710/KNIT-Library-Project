const express = require('express');

const router = express.Router();

const passport = require('passport');

// const middleware = require('../config/middleware.js');

const {allowAdminAccessOnly} = require('../config/middleware.js');

const userController = require('../controllers/user_controller');

console.log('User router loaded');

router.get('/',passport.checkAuthentication, allowAdminAccessOnly, userController.searchUser);

router.get('/profile/:id' , passport.checkAuthentication , userController.profile);

router.get('/profile/:id/edit',passport.checkAuthentication,userController.editProfile);

router.post('/profile/:id/update',passport.checkAuthentication,userController.updateProfile);

// router.get('/profile/:id/delete',userController.deleteProfile);

router.get('/login', userController.login);

router.get('/signup',userController.signup);

router.post('/create',userController.create);

router.post('/create-session', 
	passport.authenticate('local',{failureRedirect:'/users/login'})
	,userController.createSession);

router.get('/remove-session',userController.removeSession);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));

router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),userController.createSession);

router.get('/auth/github',passport.authenticate('github',{scope:['profile','email']}));

router.get('/auth/github/callback',passport.authenticate('github',{failureRedirect:'/users/login'}),userController.createSession);

router.post('/reset_password',userController.resetToken);

router.get('/reset_password/token/:id/',userController.resetPasswordPage);

router.post('/reset_password/:id/',userController.resetPassword);

router.get('/confirm_account/:id',userController.confirmAccount);

module.exports = router;