let nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');
const env = require('./environment');

//this part sends the email..defines how this communication is going to take place
let transporter = nodemailer.createTransport({
  service: 'gmail',
  host:'smtp.gmail.com', 
  port:587, //tls more secure than ssl
  secure:false, //if 2 factor auth
  auth: {
    user: env.gmail_id,
    pass: env.gmail_password
  }
});

//Html file template stored in mailers folder
let renderTemplate = (data,relativePath) => {
  let mailHTML;
  ejs.renderFile(
    path.join(__dirname,'../views/mailers',relativePath),
    data,
    function(err,template){
      if(err){console.log('Error in rendering template',err); return;}
      mailHTML = template;
    }
  );
  return mailHTML;
}

module.exports = {
  transporter : transporter,
  renderTemplate : renderTemplate
}
