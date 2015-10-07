// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Member', new Schema({ 
    title: String, 
    body: String, 
    pictures: {
    	type:Array,
    	"default":[]
    },
    reviews: {
    	type:Array,
    	"default":[]
    },
    posttime :Date,
    author: String
}));