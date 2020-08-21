const env = require('./environment.js');

module.exports.setFlash = function(req,res,next){
	res.locals.flash={
		'success': req.flash('success'),
		'error': req.flash('error'),
		'long':req.flash('long')
	}
	next();
}
module.exports.allowAdminAccessOnly = function(req,res,next){
	if(req.user.email == env.ADMIN_EMAIL){
		return next();
	}else{
		req.flash('error','Unauthorised Operation');
		return res.redirect('back');
	}
}

module.exports.allowAdminAndOwnerAccessOnly = function(req,res,next){
	if(req.user.email == env.ADMIN_EMAIL || req.params.id == req.user.id){
		return next();
	}else{
		req.flash('error','Unauthorised Operation');
		return res.redirect('back');
	}
}

module.exports.adminEmail = function(req, res, next){
	res.locals.adminEmail = env.ADMIN_EMAIL;
	next();
}