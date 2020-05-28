const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
// const newUserMailer = require('../mailers/new_user_mailer');


passport.use(new googleStrategy({
clientID:"515877074226-nav9d0348j9r95i7408u0bbc1u84qfdq.apps.googleusercontent.com",
clientSecret:"bIKkoWyHQeGN8FTq4o3m8TSl",
callbackURL:"http://localhost:3000/users/auth/google/callback"

},function(accessToken , refreshToken , profile , done){
	User.findOne({email:profile.emails[0].value}).exec(function(err,user){
		if(err){
			console.log(`Error in passport google ${err}`);
			return;
		}
		console.log(profile);
		console.log(accessToken,refreshToken);
		if(user){
			return done(null,user);
		}else{
			User.create({
				name: profile.displayName,
				email: profile.emails[0].value,
				password: crypto.randomBytes(8).toString('hex'),
				isValid:true
			},function(err,user){
				if(err){
				console.log(`Error in creating user : passport google ${err}`);
				return;
				}
				// newUserMailer.newUser(user);
				return done(null,user);
			});
		}
	})
}

))

module.exports = passport;