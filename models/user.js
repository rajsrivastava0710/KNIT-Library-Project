const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	name:{
		type:String,
		required:true
	},
	rollNo:{
		type:Number
	},
	branch:{
		type:String
	},
	course:{
		type:String
	},
	mobile:{
		type:Number
	},
	fine:{
		type:Number
	},
	isValid:{
		type:Boolean,
		default:false,
	},
	activationKey:{
		type:String
	},
	availedBooks:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'IssueRecord'
		}
	],
	pastBooks:[
		{
			type: mongoose.Schema.Types.ObjectId,
			ref:'IssueRecord'
		}
	],
},{
	// time for created at and updated at 
	timestamps:true
});

const User = mongoose.model('User',userSchema);

module.exports = User;

