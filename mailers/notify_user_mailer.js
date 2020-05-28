const nodeMailer = require('../config/nodemailer');
//new way to export like module.exports = 
exports.notifyUser = (user,bookName) => {
	let htmlString = nodeMailer.renderTemplate({user:user,bookName:bookName},'/users/notify_user.ejs');
	nodeMailer.transporter.sendMail({
		from: 'rajsriv.14@gmail.com',
		to: user.email,
		subject:'Notification from KNIT-Library !',
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
