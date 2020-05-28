const nodeMailer = require('../config/nodemailer');
//new way to export like module.exports = 
exports.newUser = (user) => {
	let htmlString = nodeMailer.renderTemplate({user:user},'/users/new_user.ejs');
	nodeMailer.transporter.sendMail({
		from: 'rajsriv.14@gmail.com',
		to: user.email,
		subject:'Welcome from KNIT-Library !',
		html: htmlString
	},(err,info) => {
		if(err){
			console.log(`Error sending mail : ${err}`);
			return;
		}
		console.log('Message has been sent',info);
		return;
	});
}
