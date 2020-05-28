const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.use(new LocalStrategy({
	usernameField : 'email',
	passReqToCallback : true
	},
	function(req,email, password, done){
		User.findOne({email:email},function(err,user){
			if(err){
				req.flash('error',err);
				return done(err);
			}
			if(!user || user.password != password){
				req.flash('error','Invalid Username/Password');
				return done(null,false);
				//no error and no authentication proved
			}
			else if(!user || user.isValid == false){
				req.flash('error','Your account is not yet verified! Verify it to login :)');
				return done(null,false);
			// 	//no error and no authentication proved
			}
			return done(null,user);
			//no error and auth proved
		});
	}

));

//serialize user fn
passport.serializeUser(function(user,done){
	done(null, user.id);
});

//deserialize user fn
passport.deserializeUser(function(id,done){
	User.findById(id, function(err, user){
		if(err){
			console.log('Error in finding user #passport');
			return done(err);
		}
		return done(null, user);
	});
});


//check if user is authenticated

passport.checkAuthentication = function(req,res,next){
	// if signed in
	if(req.isAuthenticated()){
		return next();
	}
	//if not signed in
		return res.redirect('/users/login');
}

passport.setAuthenticatedUser = function(req,res,next){
	if(req.isAuthenticated()){
		//passing to views using res.locals
		res.locals.user = req.user;
		//req.user contains logged in user info from session cookie
	}
	next();
}


module.exports = passport;