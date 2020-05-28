const Book = require('../models/book');
const User = require('../models/user');
const moment = require('moment');
// const Comment = require('../models/comment');
const IssueRecord = require('../models/issue_record');
const notifyUserMailer = require('../mailers/notify_user_mailer.js');

module.exports.library = async function(req,res){
	if(Object.keys(req.query).length>0 && req.query.book){
		let search_query = '^'+req.query.book;
		let books = await Book.find({name:{'$regex':search_query,$options:'i'},copyAvailable:false});
		return res.render('library',{
			title:'Library Page',
			books:books
		});
		}
	// let books = await Book.distinct('name',{});
	// let allBooks = await Book.find({name:books});
	let allBooks = await Book.find({copyAvailable:false})
		return res.render('library',{
		title:'Library Page',
		books:allBooks
	});
}

module.exports.bookDetails = async function(req,res){
	try{
	let book = await Book.findById(req.params.id).populate('owner')
			.populate(
				{
					path:'pastOwner owner',
					populate:{
					path:'user book'
					}
				})
			.populate(
				{
					path: 'comments',
					populate:{
					path: 'user'
					}
				});
	let copies = await Book.find({
		name:book.name
	})
	console.log(copies);
	return res.render('bookDetail',{
		title:'Book Details',
		book:book,
		copies:copies
	});
	}catch(err){
		console.log(err);
		return res.redirect('/library');
	}
	
}


module.exports.occupyList = async function(req,res){ 
	try{
		if(req.user.email == 'rajsriv.14@gmail.com'){  //admin only
			if(Object.keys(req.query).length>0){
			let records = await IssueRecord.find({isPast:req.query.past_data}).sort('-createdAt').populate('user book');
			// records = await records.populate('user').execPopulate();
			return res.render('occupyList',{
				title:'Books-Users Page',
				records:records
			});
			}
			let records = await IssueRecord.find({}).sort('-createdAt').populate('user book');
			// records = await records.populate('user').execPopulate();
			return res.render('occupyList',{
				title:'Books-Users Page',
				records:records
			});	
		}else{
			return res.redirect('back');
		}
		
	}catch(err){
		console.log(err);
		return res.redirect('back');
	}
}

module.exports.addBook = function(req,res){
	if(req.user.email == 'rajsriv.14@gmail.com'){ //admin id only
		return res.render('addBook',{
		title:'Add new Book'
	});	
	}else{
		return res.redirect('back');
	}
	
}

module.exports.createBook = async function(req,res){
	try{
		if(req.user.email == 'rajsriv.14@gmail.com'){//admin id only
			let exists = await Book.findOne({
				name:req.body.name
			});

			let book = await Book.create(req.body)
			book.creator = req.user.id;
			if(exists){
				book.copyAvailable = true;	
			}
			book.save();
			req.flash('success','Book successfully created !');
			return res.redirect('/library');
		}
	}catch(err){
		console.log(err);
		req.flash('error','Error while creating book ..');
		return res.redirect('back');
	}
}

module.exports.notifyBook = async function(req,res){
	try{
		let book = await Book.findById(req.params.id);
		book.notifyUser.push(req.user._id);
		book.save();
		//remove duplicate request;todo
		req.flash('success','You will be notified via E-Mail ,once the book gets free')
		return res.redirect('back');
	}catch(err){
		if(err){
			req.flash('error','Some error occured');
			console.log(err);
			return res.redirect('back');
		}
	}
}

module.exports.availBook = async function(req,res){
	try{
		if(req.user.email == 'rajsriv.14@gmail.com'){   //admin only

			let book = await Book.findById(req.params.id);
			let user = await User.findOne({email:req.query.email});
			if(book && user && book.isAvailable && user.availedBooks.length<=1){//max 2 book at a time
			
				let user = await User.findOne({email:req.query.email});
				let record = await IssueRecord.create({
					user : user.id,
					book : book.id,
					isPast : false
				});
				book.isAvailable = false;
				book.owner = record.id;
				book.save();
				
				user.availedBooks.unshift(record.id);
				user.save();
				req.flash('success','This user has availed this book successfully !');
			}
			else if(user && user.availedBooks.length>1){
				req.flash('error','This user has already issued 2 books (Maximum Limit for a single user is 2 books)');
				return res.redirect(`/library/book/${book.id}`);
			}else if(!user){
				req.flash('error','No such user exists !');
				return res.redirect(`/library/book/${book.id}`);
			}else{
				req.flash('error','This book is not available right now!');
				return res.redirect(`/library/book/${book.id}`);
			}
			return res.redirect('back');
		}else{
			return res.redirect('back');
		}
		
	}catch(err){
		console.log(err);
		return res.redirect('/library');
	}
	
}

module.exports.returnBook = async function(req,res){
	try{
		if(req.user.email == 'rajsriv.14@gmail.com'){   //admin only

			let book = await Book.findById(req.params.id)
								.populate(
								{
									path:'owner notifyUser',
									populate:{
									path:'user book'
									}
								});
			let record = await IssueRecord.find({$and:[{book:req.params.id},{user:req.query.user_id},{isPast:false}]}).sort('-createdAt');
			if(book && req.query.user_id == book.owner.user.id){
				book.isAvailable = true;
				book.owner = null;
				book.pastOwner.unshift(record[0].id);
				book.save();
				await User.findByIdAndUpdate(req.query.user_id, { $pull: {availedBooks: record[0].id}});
				let user = await User.findById(req.query.user_id);
				user.pastBooks.unshift(record[0].id);
				user.save();
				// let record = await IssueRecord.findOneAndDelete({$and:[{user:user.id},{book:book.id}]});
				record[0].isPast = true;
				record[0].returnDate = Date.now();
				
				let time = moment(record[0].returnDate).diff(moment(record[0].createdAt),'months');
				if(time>60){//60 days no fine
					let extra = time-(60);
					let easyFine = 0 , harshFine = 0;
					easyFine = Math.min(extra,30); //1rupee/day for next 30 days
					if(extra-30>0){
					harshFine = (extra-30)*2;  //2rupee/day for next all days
					}
					record[0].fine = easyFine + harshFine;
				}else{
					record[0].fine = 0;
				}

				record[0].save(); 
				let notify = [... new Set(book.notifyUser)];
				//Nodemailer
				for(let i=0;i<notify.length;i++){
				notifyUserMailer.notifyUser(notify[i],book.name);
				}
				book.notifyUser=[];
				book.save();

				req.flash('success','The book has been successfully returned !');
			}

			return res.redirect('back');

		}else{
			return res.redirect('back');
		}
	}catch(err){
		console.log(err);
		req.flash('error','We encountered some error while returning the book..');
		return res.redirect('/library');
	}
}

module.exports.editBook = function(req,res){
	// Book.findById(req.params.id)
	// 		.populate({
	// 			path:'owner',
	// 			populate:{
	// 				path:'user book'
	// 			}
	// 		}).exec(function(err,book){
		Book.findById(req.params.id,function(err,book){
			if(err){
				console.log(err);
				req.flash('error','We encountered some error..');
				return res.redirect('back');
			}
			if(book.creator == req.user.id /*|| req.user.email == 'rajsriv.14@gmail.com'*/){
				return res.render('editBook',{
				title:'Edit Book',
				book:book
			})
			}else{
				req.flash('error','You can not perform this operation..');
				return res.redirect(`/library/book/${book.id}`);		
			}	
		});
}

module.exports.updateBook = async function(req,res){
	try{
		let book = await Book.findById(req.params.id)
			.populate({
				path:'owner',
				populate:{
					path:'user book'
				}
			});
		if(book.creator == req.user.id /*|| req.user.email == 'rajsriv.14@gmail.com'*/){
			await Book.findByIdAndUpdate(req.params.id,req.body);
			req.flash('Book details updated successfully !');
			return res.redirect(`/library/book/${req.params.id}`);
		}else{
			req.flash('error','You are not authorised to update this book ..');
			return res.redirect('/');
		}

	}catch(err){
		console.log(err);
		req.flash('error','Error in updating book details ..');
		return res.redirect('back');
	}
}