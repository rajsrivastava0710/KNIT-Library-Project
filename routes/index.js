const express = require('express');

const router = express.Router();

const homeController = require('../controllers/home_controller');

console.log('Home router loaded');

router.get('/',homeController.home);

router.get('/fine-calculator',homeController.finePage);

router.get('/contacts',homeController.contacts);

router.get('/rules',homeController.rules);

router.use('/users',require('./users'));

router.use('/library',require('./library'));

router.get('*',function(req,res){
	return res.render('error404',{
		title:'Page Not Found'
	});
});

module.exports = router;