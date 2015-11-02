var nodemailer = require('nodemailer');
module.exports = function(app){
//CONTACT US
// --------------------------------------------------------
app.post('/contact',function(req,res){

    console.log(req.body);
    console.log('received email request');
    /*
    var generator = require('xoauth2').createXOAuth2Generator({
        user: 'zxw120230@gmail.com',
        clientId: '360476010879-jv4o487i67cshjh383ehc24q8m7hpfga.apps.googleusercontent.com',
        clientSecret: 'LLgqxMTeiwd9ChEgHZRrUy3u',
        refreshToken: '{refresh-token}',
        accessToken: '{cached access token}' // optional
    });*/
    var mailOpts,smtpTrans;

    //Setup Nodemailer transport, I chose gmail. Create an application-specific password to avoid problems.
    smtpTrans = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:'zxw120230@gmail.com',
            pass:'SuperSecurity@888'
        }   
    });

    //Mail options //Fred Foo ✔ <foo@blurdybloop.com>
    mailOpts = {
        from : req.body.name + ' ✔ <' + req.body.email + '>',
        to: 'sf.jackwang@gmail.com',
        subject: 'Westlake Pioneers ✔',
        text: req.body.message+' ✔',
        html: '<b>'+req.body.message+' ✔</b>' // html body
    };

    smtpTrans.sendMail(mailOpts, function (error, response) {

        if (error) {
            console.log(error);
            res.send('Something must be wrong, please try again...');

        }else{
            console.log('Success');
            res.send('Thank you for contacting us. We received your email!');
        }

    });
});
};
