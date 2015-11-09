(function(){
    'use strict';
}());
var config = require('../config');
var jsforce = require('jsforce');
var AR_USR = process.env.AR_USR||config.AR_USR;
var AR_PWD = process.env.AR_PWD||config.AR_PWD;
module.exports = function(app){
app.get('/SFDC/companyInfo/:companyName',function(req,res){
	console.log('***************************SFDC request...***************************************');
	var accountName = req.params.companyName;
	var companyquery = 'SELECT Id,Client_Territories__c,Name FROM Account WHERE Name = \''+accountName+'\'';
	var voicemailQuery = 'select count(Id) from task where CallType__c=\'Left Voicemail\' and createddate = last_month and Client_Territories__c= \'';
	var convwithcsuiteQuery = 'select count(Id) from task where CallType__c=\'Conversation\' and createddate = last_month and Contact_Type__c=\'C-Suite\' and Client_Territories__c= \'';  
	var conversationwithhrQuery = 'select count(Id) from task where CallType__c=\'Conversation\' and createddate = last_month and Contact_Type__c=\'HR\' and Client_Territories__c= \'';  
	var ConversationOtherQuery = 'select count(Id) from task where CallType__c=\'Conversation\' and createddate = last_month and Contact_Type__c=\'Other\' and Client_Territories__c= \'';  
	var NewOpportunityGeneratedQuery = 'select count(Id) from opportunity where createddate = last_month and opportunity.Parent_Account__c.Client_Territories__c= \'';
	var conn = new jsforce.Connection();
	var responseData = {
		"voicemail":0,
		"ConversationwithCSuite":0,
		"ConversationwithHR":0,
		"ConversationOther":0,
		"NewOpportunityGenerated":0
	};
	var territory=null;
	conn.login(AR_USR, AR_PWD, function(sfdcerr, sfdcres) {
	if (sfdcerr) { 
	  	console.log(sfdcerr); 
	}	
	console.log('logged in...');
	//Request company territory  
	conn.query(companyquery).
	then(function(sfdcerr,sfdcres){
		if (sfdcerr) { 
		  	console.log(sfdcerr); 
		}
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
	    convwithcsuiteQuery = convwithcsuiteQuery + territory + '\'';
	    conversationwithhrQuery = conversationwithhrQuery + territory + '\'';
	    ConversationOtherQuery = ConversationOtherQuery + territory + '\'';
	    NewOpportunityGeneratedQuery = NewOpportunityGeneratedQuery + territory + '\'';
	    console.log(voicemailQuery); 
	    return conn.query(voicemailQuery);

		
	}).then(function(sfdcerr,sfdcres){
		if (sfdcerr) { 
		  	console.log(sfdcerr); 
		}
		if(sfdcres===null||sfdcres.records.length<1){
			res.send('Problem getting number of voicemail...');
	    }
	    console.log('parseInt(sfdcres.records[0].expr0): '+parseInt(sfdcres.records[0].expr0));
	    responseData.voicemail = parseInt(sfdcres.records[0].expr0);
	    conn.query(convwithcsuiteQuery,function(error,response){
	    	if(error){
	    		console.log(error);
	    	}
	    	if(response===null||response.records.length<1){
				response.send('Problem getting number of ConversationwithCSuite...');
		    }
		    responseData.ConversationwithCSuite = parseInt(response.records[0].expr0);
	    });
	    conn.query(conversationwithhrQuery,function(error,response){
	    	if(error){
	    		console.log(error);
	    	}
	    	if(response===null||response.records.length<1){
				response.send('Problem getting number of ConversationwithHR...');
		    }
		    responseData.ConversationwithHR = parseInt(response.records[0].expr0);
	    });
	    conn.query(ConversationOtherQuery,function(error,response){
	    	if(error){
	    		console.log(error);
	    	}
	    	if(response===null||response.records.length<1){
				response.send('Problem getting number of ConversationOther...');
		    }
		    responseData.ConversationOther = parseInt(response.records[0].expr0);
	    });
	    return conn.query(NewOpportunityGeneratedQuery);

	}).then(function(sfdcerr,sfdcres){
		if (sfdcerr) { 
		  	console.log(sfdcerr); 
		}
		if(sfdcres===null||sfdcres.records.length<1){
			res.send('Problem getting number of NewOpportunityGenerated...');
	    }
	    console.log('parseInt(sfdcres.records[0].expr0): '+parseInt(sfdcres.records[0].expr0));
	    responseData.NewOpportunityGenerated = parseInt(sfdcres.records[0].expr0);
	    res.send(responseData);

	});

	
});
});	
};