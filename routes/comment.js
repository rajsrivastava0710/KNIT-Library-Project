const express = require('express');

const router = express.Router();

const passport = require('passport');

const commentController = require('../controllers/comment_controller');

console.log('Comment Router loaded !');


router.post('/:id/comment',passport.checkAuthentication,commentController.comment);

// router.post('/book/:id/comment/update',commentController.updateComment);

router.get('/:id/comment/:cid/destroy',passport.checkAuthentication,commentController.deleteComment);

module.exports = router;