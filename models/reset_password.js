const mongoose = require('mongoose');

const resetSchema = new mongoose.Schema({
	token:{
		type: String,
		required: true
	},
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User',
		required:true
	},
	isValid:{
		type: Boolean,
	}
},{
	timestamps: true
});

const Reset = mongoose.model('Reset',resetSchema);

module.exports = Reset;