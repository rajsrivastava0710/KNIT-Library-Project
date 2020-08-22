const passport = require('passport');
const githubStrategy = require('passport-github').Strategy;
const env = require('./environment.js');
const crypto = require('crypto');
const User = require('../models/user');


passport.use(new githubStrategy({
clientID: env.github_client_id,
clientSecret: env.github_client_secret,
callbackURL: env.github_callback_url,
},function(accessToken , refreshToken , profile , done){
	User.findOne({email:profile.emails[0].value}).exec(function(err,user){
		if(err){
			console.log(`Error in passport github ${err}`);
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
				password: crypto.randomBytes(10).toString('hex'),
				isValid:true
			},function(err,user){
				if(err){
				console.log(`Error in creating user : passport github ${err}`);
				return;
				}
				return done(null,user);
			});
		}
	})
}

))

module.exports = passport;