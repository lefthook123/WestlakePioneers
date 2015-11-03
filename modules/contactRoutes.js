(function(){
    'use strict';
}());
var SparkPost = require('sparkpost');

var config = require('../config');
var SPARKPOST_API_KEY = process.env.SPARKPOST_API_KEY||config.SPARKPOST_API_KEY;
var SPARKPOST_SANDBOX_DOMAIN = process.env.SPARKPOST_SANDBOX_DOMAIN||config.SPARKPOST_SANDBOX_DOMAIN;
var client = new SparkPost(SPARKPOST_API_KEY);
var from = 'admin@'+'westlakepioneers.com';
module.exports = function(app){
//CONTACT US
// --------------------------------------------------------
    app.post('/contact',function(req,res){

        console.log(req.body);
        console.log('received email request');

        var reqObj = {
          transmissionBody: {
            campaignId: 'first-mailing',
            content: {
              from: from,
              subject: req.body.name+','+req.body.email,
              html: '<html><body><p>'+req.body.message+'</p></body></html>',
              text: req.body.message
            },
            substitutionData: {name: req.body.name},
            recipients: [{ address: { name: 'Zhan Wang', email: 'sf.jackwang@gmail.com' } }]
          }
        };

        client.transmissions.send(reqObj, function(error, response) {
          if (error) {
            console.log('Whoops! Something went wrong');
            console.log(error);
            res.send('Something must be wrong, please try again...');
          } else {
            console.log('Woohoo! You just sent your first mailing!');
            res.send('Thank you for contacting us. We received your email!');
          }
        });
        

       
    });
};
