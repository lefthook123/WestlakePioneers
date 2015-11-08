(function(){
    'use strict';
}());
var config = require('../config');
var jsforce = require('jsforce');
var AR_USR = process.env.AR_USR||config.AR_USR;
var AR_PWD = process.env.AR_PWD||config.AR_PWD;
module.exports = function(app){
app.get('/SFDC/companyInfo/:companyName',function(req,res){
	console.log('SFDC request...');
	var accountName = req.params.companyName;
	var companyquery = 'SELECT Id, Name FROM Account WHERE Name = \''+accountName+'\'';
	console.log(companyquery);
	var conn = new jsforce.Connection();
	conn.login(AR_USR, AR_PWD, function(sfdcerr, sfdcres) {
	  if (sfdcerr) { 
	  	console.log(sfdcerr); 
	  }	
	  console.log('logged in...');  
	  conn.query(companyquery, function(sfdcerr, sfdcres) {
	     if (sfdcerr) {
	     	console.log(sfdcerr); 
	     }
	     console.log(sfdcres);
	     res.json(sfdcres);
	  });
	});
	

});	
};