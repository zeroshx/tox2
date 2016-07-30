module.exports = function(spot, msg) {
  var nodemailer = require('nodemailer');
  var config = require('../configs/nodemailer.js');

  var message = '[ ' + spot + ' ] ' + msg;

  var mailOptions = {
    from: 'Coderavel<coderavel@gmail.com>', // sender address
    to: 'coderavel@gmail.com, ltk8031@naver.com', // list of receivers
    subject: 'TOX2 Error Report', // Subject line
    text: message // plaintext body
  };
  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport({
    service: config.service,
    auth: {
      user: config.account,
      pass: config.password
    }
  }); // setup e-mail data with unicode symbols

  if (process.env.NODE_ENV === 'production') {
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log('NODEMAILER ERROR : ');
        return console.log(error);
      }
      console.log('NODEMAILER Message sent');
    });
    return;
  }
  console.log('NODEMAILER Message sent (DEBUG) : ' + message);
};
