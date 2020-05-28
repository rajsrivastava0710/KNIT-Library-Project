const nodeMailer = require('../config/nodemailer');
//new way to export like module.exports = 
exports.newComment = (comment) => {
	let htmlString = nodeMailer.renderTemplate({comment:comment},'/comments/new_comment.ejs');
	nodeMailer.transporter.sendMail({
		from: 'rajsriv.14@gmail.com',
		to: comment.user.email,
		// subject: `You commented : ${comment.content}`,
		subject:'New Comment in KNIT-Library',
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


