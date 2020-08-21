const User = require('../models/user');
const Reset = require('../models/reset_password');
const crypto = require('crypto');
const newUserMailer = require('../mailers/new_user_mailer.js');
const resetPasswordMailer = require('../mailers/reset_password_mailer.js');


module.exports.login = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('login',{
		title:'Login'
	});
}

module.exports.signup = function(req,res){
	if(req.isAuthenticated()){
		return res.redirect(`/users/profile/${req.user.id}`);
	}
	return res.render('signup',{
		title:'Signup'
	});
}

module.exports.create = async function(req,res){
	try{
		if(req.body.password != req.body.confirm_password){
			console.log('Password does not match');
			return res.redirect('back');
		}else{
		let user = await User.findOne({email:req.body.email});
		if(user){
			console.log('This E-Mail Id already exists');
			return res.redirect('back');
		}
		let newUser = await User.create(req.body);
		newUser.activationKey = crypto.randomBytes(10).toString('hex');
		newUser.save();

		//Nodemailer
		newUserMailer.newUser(newUser);
		
		console.log('New User created');
		req.flash('User signed up successfully !');
		req.flash('long','We are sending account activation link to your E-Mail Id');		
				
		return res.redirect('/users/login');
		}
	}catch(err){
		console.log(err);
		return res.redirect('back');
	}	
}

module.exports.createSession = function(req,res){
	req.flash('success','Logged in successfully!');
	return res.redirect('/');
}

module.exports.removeSession = function(req,res){
	req.logout();
	req.flash('success','Logged out successfully..');
	return res.redirect('/');
}

module.exports.searchUser = async function(req,res){
	if(Object.keys(req.query).length>0){
		let search_user = await User.findOne({email:req.query.email});
		console.log([search_user])
		return res.render('searchUser',{
		title:'KNIT-Library Users',
		search_user:[search_user]
	})
	}else{
		let search_user = await User.find({});
		console.log(search_user)
		return res.render('searchUser',{
		title:'KNIT-Library Users',
		search_user:search_user
		})	
	}
	
}

module.exports.profile = async function(req,res){
	try{
		let user = await User.findById(req.params.id)
						.populate(
							{
								path:'availedBooks',
								populate:{
								path:'user book'
								}
							})
						.populate(
							{
								path:'pastBooks',
								populate:{
								path:'user book'
								}
							});
			return res.render('userProfile',{
			title:'Profile',
			profile_user:user
		});		
	}catch(err){
		console.log(err);
		return res.redirect('back');
	}
}

module.exports.editProfile = function(req,res){
		User.findById(req.params.id,function(err,user){
			return res.render('editUserProfile',{
			title:'Edit Profile',
			editUser:user
			});
		});
}

module.exports.updateProfile = async function(req,res){
	try{
		let user = await User.findById(req.params.id);
			if(req.body.email){
				req.body.email = user.email;
			}
			if(req.body.password){
				req.body.password = user.password;
			}
			await User.findByIdAndUpdate(req.params.id,req.body);
			req.flash('success','Your profile has been updated now !');
			return res.redirect(`/users/profile/${req.params.id}`);
	}catch(err){
		req.flash('error','Error while updating profile ..')
		console.log(err);
		return res.redirect('back');
	}
}

module.exports.resetToken = async function(req,res){
	try{
		let user = await User.findOne({email:req.body.email});
		if(user){
			let reset = await Reset.findOne({user:user.id});
			
			if(!reset){
				await Reset.create({
				token:crypto.randomBytes(10).toString('hex'),
				user:user.id,
				isValid:true
			});
				reset = await Reset.findOne({user:user.id});
			}
			reset.isValid = true;
			reset.save();
			
			
			reset = await reset.populate('user').execPopulate();

			//Nodemailer Mail
			resetPasswordMailer.resetLink(reset);
			//
			
			req.flash('long','We will be sending the password reset link to this E-Mail Id shortly!')
			return res.redirect('back');
		}else{
			req.flash('error','This E-Mail Id does not exist in our database');
			return res.redirect('back');
		}
	}catch(err){
		console.log('Reset Token Error',err);
		return ;
	}
}

module.exports.resetPasswordPage = async function(req,res){
	let reset = await Reset.findOne({token:req.params.id});
	if(reset.isValid == true){
		return res.render('resetPassword',{
		resetToken : req.params.id,
		title:'Socialera/Reset Password'
		});
	}else{
		return res.status(403).json({
			message:'Your token has expired'
		})
	}
	
}

module.exports.resetPassword = async function(req,res){
	try{
		let reset = await Reset.findOne({token:req.params.id});
		if(req.body.password == req.body.confirm_password){
			if(reset){
				reset = await reset.populate('user').execPopulate();

				if (reset.isValid) {
					let user = await User.findById(reset.user);
					user.password = req.body.password;
					user.save();
					// await reset.remove();
					reset.isValid = false;
					reset.save();
					req.flash('success','Password Reset done successfully !')
					return res.redirect('/users/login');
				
				}else{
					return res.status(403).json({
					message:'Your token has expired.Generate a new token again'
					})
				}
			
			}else{
				return res.status(403).json({
					message:'Your token does not exist'
				})
			}
		}else{
			// if(reset){
			// 	reset.isValid = false;
			// 	reset.save();
			// }
			return res.send('Passwords do not match !');
		}
	}catch(err){
		console.log('Reset Password Error',err);
		return ;
	}
}

module.exports.confirmAccount = async function(req,res){
	try{
	let user = await User.findOne({activationKey:req.params.id});
	if(user.isValid){
	return res.send('We have already authenticated you!');
	}
	user.isValid=true;
	user.activationKey = crypto.randomBytes(10).toString('hex');
	user.save();//just for future safety purpose -maybe
	req.flash('long','You have been authenticated successfully ! You can login now..')
	return res.redirect('/users/login');

	}catch(err){
		return res.status(403).json({
			message:'This token has expired now!'
		})
		console.log(err);
		return;
	}
}