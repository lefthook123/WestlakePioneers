var User = require('../models/user');
var jwt = require('jsonwebtoken');
var mongoose = require("mongoose");
module.exports = function(app){
//USER
// --------------------------------------------------------
app.post('/admin/postuser',function(req,res){

    var reqBody=req.body;
    console.log(reqBody);


    var user = new User({
            email:reqBody.email,
            password:'Password',
            admin:reqBody.admin,
            company:reqBody.company,
            createddate:Date.now(),
            createdby:reqBody.createdby,
            isactive:true
    });
    user.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('User saved successfully');
        res.json({success: true});
    });
});
app.delete('/admin/deleteuser/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deleteuser request');
    User.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.put('/admin/updateuser/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateuser request');
    var blogbody = req.body.body;
    var blogtags=req.body.tags;
    Blog.findOneAndUpdate(
        {_id:objectId},
        {
            body:blogbody,
            tags:blogtags
        },function(err,article){
            if(err)throw err;
        });
});
app.get('/admin/retrieveusers', function(req, res){
    console.log('users get request');
    User.find({},function(err,users){
        console.log(users);
        res.json(users);
    });
});
app.post('/authenticate',function(req,res){
    console.log('login post request!');
    User.findOne({
        email:req.body.email
    },function(err,user){
        console.log(user);
        if(err) throw err;
        if(!user){
            res.json(404,'Authentication failed. User not found');
        }else if(user){
            if(user.password != req.body.password){
                res.json(404,'Authentication failed. Wrong password.');
            }else{
                var token = jwt.sign(user,app.get('superSecret'),{
                    expireInMinutes:1440 //expires in 24 hours
                });

                res.json(
                    {token:token,user:user}
                );
            }
        }
    });
});
};