const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
	copyAvailable:{
		type:Boolean,
		default:false
	},
	isbn:{
		type:Number,
		required:true,
		unique:true
	},
	name:{
		type:String,
		// required:true
	},
	writer:{
		type:String,
		required:true
	},
	publication:{
		type:String,
		required:true
	},
	category:{
		type:String
	},
	isAvailable:{
		type:Boolean,
		default:true
	},
	creator:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	owner:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'IssueRecord',
		default:null
	},
	pastOwner:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'IssueRecord'
		}
	],
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'Comment'
		}
	],
	notifyUser: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'User'
		}
	]
},{
	timestamps:true
});

const Book = mongoose.model('Book',bookSchema);

module.exports = Book;

