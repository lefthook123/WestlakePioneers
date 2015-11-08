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
	var companyquery = 'SELECT Id,Client_Territories__c,Name FROM Account WHERE Name = \''+accountName+'\'';
	var voicemailQuery = 'select count(Id) from task where CallType__c=\'Left Voicemail\' and createddate = last_month and Client_Territories__c= \'';
	console.log(companyquery);
	var conn = new jsforce.Connection();
	var responseData = {
		"voicemail":0,
		"ConversationwithCSuite":0
	};
	var territory=null;
	conn.login(AR_USR, AR_PWD, function(sfdcerr, sfdcres) {
	if (sfdcerr) { 
	  	console.log(sfdcerr); 
	}	
	console.log('logged in...');  
	conn.query(companyquery).
	then(function(sfdcres){
		if(sfdcres===null||sfdcres.records.length<1){
	     	console.log('Can not find the Advisor Account');
	     	res.send('Can not find the Advisor Account');
	    }
	    territory = sfdcres.records[0].Client_Territories__c;
	    console.log('territory: '+territory);
	    if(territory===null||territory===''){
	     	console.log('Advisor with no client territory assigned.');
	     	res.send('Advisor with no client territory assigned.');
	    }
	    voicemailQuery = voicemailQuery + territory + '\'';
	    console.log(voicemailQuery); 
		conn.query(voicemailQuery).
			then(function(sfdcerr, sfdcres){
		    	if (sfdcerr) {
		     		console.log('sfdcerr: '+sfdcerr); 
		    	}
		    	if(sfdcres===null||sfdcres.records.length<1){
			     	res.send('Problem getting number of voicemail...');
			    }
			    console.log('parseInt(sfdcres.records[0].expr0): '+parseInt(sfdcres.records[0].expr0));
			    responseData.voicemail = parseInt(sfdcres.records[0].expr0);
		     	
			});
	})
	.then(function(){
		res.json(responseData);
		console.log('responseData: '+responseData);
	},function(err){
		console.log(err);
	});
	
});
});	
};