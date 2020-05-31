const express = require('express');

const router = express.Router();

const passport = require('passport');

const { allowAdminAccessOnly } = require('../config/middleware.js');

const libraryController = require('../controllers/library_controller');

console.log('Books router loaded');

router.get('/',libraryController.library);

router.get('/book/:id',passport.checkAuthentication,libraryController.bookDetails);

router.get('/book/:id/edit',passport.checkAuthentication,libraryController.editBook);

router.post('/book/:id/update',passport.checkAuthentication,libraryController.updateBook);

// router.get('/book/:id/delete',passport.checkAuthentication,libraryController.deleteBook);

router.get('/book/:id/notify',passport.checkAuthentication,libraryController.notifyBook);

router.get('/book/:id/avail',passport.checkAuthentication,libraryController.availBook);

router.get('/book/:id/return',passport.checkAuthentication, allowAdminAccessOnly, libraryController.returnBook);

router.get('/add-book',passport.checkAuthentication, allowAdminAccessOnly, libraryController.addBook);

router.post('/add-book/create',passport.checkAuthentication, allowAdminAccessOnly, libraryController.createBook);

router.get('/userlist',passport.checkAuthentication, allowAdminAccessOnly, libraryController.occupyList);

router.use('/book',require('./comment'));

module.exports = router;