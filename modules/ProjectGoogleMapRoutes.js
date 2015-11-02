var ToolGoogleMapUser = require('../models/toolGoogleMapUser.js');
module.exports = function(app){
// Google Map START

// GET Routes
// --------------------------------------------------------
// Retrieve records for all toolgooglemapusers in the db
app.get('/toolgooglemapusers',function(req,res){
    var query = ToolGoogleMapUser.find({});
    query.exec(function(err,toolgooglemapusers){
        if(err)
            res.send(err);
        res.json(toolgooglemapusers);
    });
});

// POST Routes
// --------------------------------------------------------
// Provides method for saving new users in the db

app.post('/toolgooglemapusers',function(req,res){
    var newtoolgooglemapuser = new ToolGoogleMapUser(req.body);
    newtoolgooglemapuser.save(function(err){
        if(err)
            res.send(err);
        res.json(req.body);
    });

});

// Google Map END
};