const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(sails.config.sendgridApiKey);


// A service for sending emails
module.exports = {
    sendVerifcationCodeEmail: function(options) {
        const msg = {
            to: options.email,
            from: 'help@kratos.com',
            subject: 'Kratos: Verification Code',
            text: `Hi ${options.email}! Your verification code is ${options.verificationCode}. Enter this code on the 'Reset Password' screen.`,
            html: `
            Hi ${options.email}!<br><br>
            Your verification code is <strong>${options.verificationCode}</strong>. Enter this code on the 'Reset Password' screen.<br><br>
            <strong>Team Kratos</strong>`,
           };
        this.sendEmail(msg);
    },
    sendWelcomeEmail: function(options) {
        const msg = {
            to: options.email,
            from: 'help@kratos.com',
            subject: 'Kratos: Welcome',
            text: `Hi ${options.name}! Welcome to Kratos! We are so sicked that you joined us!`,
            html: `
            Hi ${options.name}!<br><br>
            Welcome to Kratos! We are so sicked that you joined us!<br><br>
            <strong>Team Kratos</strong>`,
           };
        this.sendEmail(msg);     
    },
    sendEmail: function(msg) {
        const emailsEnabled = false;
        if(emailsEnabled) {
            sgMail.send(msg);
        }
    }
}