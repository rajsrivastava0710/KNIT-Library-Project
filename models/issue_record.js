const mongoose = require('mongoose');

const issueRecordSchema = new mongoose.Schema({
	// days:{
	// 	type: Number,
	// 	required: true
	// },
	user:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'User'
	},
	book:{
		type: mongoose.Schema.Types.ObjectId,
		ref:'Book'
	},
	isPast:{
		type:Boolean,
		default:false
	},
	returnDate:{
		type:Date
	},
	fine:{
		type:Number,
		default:0
	}
},{
	timestamps: true
});

const IssueRecord = mongoose.model('IssueRecord',issueRecordSchema);

module.exports = IssueRecord;