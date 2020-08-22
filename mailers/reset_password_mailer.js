const nodeMailer = require('../config/nodemailer');

const env = require('../config/environment');

//new way to export like module.exports = 
exports.resetLink = (reset) => {
	let htmlString = nodeMailer.renderTemplate({reset:reset},'/users/reset_password.ejs');
	nodeMailer.transporter.sendMail({
		from: env.gmail_id,
		to: reset.user.email,
		subject:'KNIT-Library Password Reset !',
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
