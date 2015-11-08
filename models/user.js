// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('User', new Schema({ 
    email: {
    	type:String,
    	validate:{
    		validator: function(v){
    			return /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(v);
    		},
    		message: '{VALUE} is not a valid email!'
    	}
    }, 
    password: String, 
    admin: {type:Boolean,default:false},
    company: String,
    latestLoginTime:Date,
    latestLoginIP:String,
    createddate:{type:Date,default:Date.now},
    createdby:String,
    isactive: {type:Boolean,default:true}
}));