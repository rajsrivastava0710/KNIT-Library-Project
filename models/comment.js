const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
	content:{
		type: String,
		required: true
	},
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	book:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Book'
	}

},{
	timestamps: true
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;