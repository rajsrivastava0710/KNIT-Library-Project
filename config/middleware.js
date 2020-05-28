module.exports.setFlash = function(req,res,next){
	res.locals.flash={
		'success': req.flash('success'),
		'error': req.flash('error'),
		'long':req.flash('long')
	}
	next();
}