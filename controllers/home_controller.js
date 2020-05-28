module.exports.home = function(req,res){
	return res.render('homePage',{
		title:'LandingPage'
	});
}

module.exports.finePage = function(req,res){
	return res.render('finePage',{
		title:'Fine Calculator'
	});
}

module.exports.contacts = function(req,res){
	return res.render('contacts',{
		title:'Contact Us'
	});
}


module.exports.rules = function(req,res){
	return res.render('rules',{
		title:'Library Rules'
	});
}