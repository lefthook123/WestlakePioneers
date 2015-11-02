// get an instance of mongoose and mongoose.Schema
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
module.exports = mongoose.model('Service', new Schema({ 
    name: String, 
    alt: String, 
    imageUrl: Boolean,
    description: String
}));