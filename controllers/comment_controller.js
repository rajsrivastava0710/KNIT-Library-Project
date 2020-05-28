const Book = require('../models/book');
// const User = require('../models/user');
const Comment = require('../models/comment');
// const IssueRecord = require('../models/issue_record');
const commentsMailer = require('../mailers/comments_mailer');

module.exports.comment = async function(req,res){
	try{
		let book = await Book.findById(req.params.id);
		let comment = await Comment.create({
			content:req.body.content,
			user:req.user.id,
			book:req.params.id
		});
		book.comments.unshift(comment);
		book.save();
		comment = await comment.populate('user', 'name email').execPopulate();

		//Nodemailer
		// commentsMailer.newComment(comment);

		if (req.xhr){
			// Similar for comments to fetch the user's id!
    
            return res.status(200).json({
                data: {
                    comment: comment
                },
                message: "Comment created!"
            });
        }


		req.flash('success','You commented on this book');
		return res.redirect('back');
	}catch(err){
		console.log(err);
		req.flash('error','Error while commenting..');
		return res.redirect('/library');
	}
}


module.exports.deleteComment = async function(req,res){
	try{
		let comment = await Comment.findById(req.params.cid);
		if(req.user.id == comment.user){
			comment.remove();
			let book = await Book.findByIdAndUpdate(req.params.id, { $pull: {comments: req.params.cid}});

			// send the comment id which was deleted back to the views
            if (req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.cid,
                        book_id:req.params.id
                    },
                    message: "Comment deleted"
                });
            }

			req.flash('success','Comment deleted sucessfully !');
		}else{
			req.flash('error','You are not authorised for this !');
		}
		return res.redirect('back');
			
	}catch(err){
		req.flash('error','Error on deleting comment..');
		console.log(err);
		return res.redirect('back');
	}
}