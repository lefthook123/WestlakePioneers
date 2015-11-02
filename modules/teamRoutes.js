var Member = require('../models/member');
var mongoose = require("mongoose");
module.exports = function(app){

//TEAM
// --------------------------------------------------------
app.post('/admin/postmember',function(req,res){
    var reqBody=req.body;
    var member = new Member({
            title:reqBody.title,
            bio:reqBody.bio,
            photo:reqBody.photo,
            name:reqBody.name,
            email:reqBody.email,
            DateJoined:reqBody.DateJoined,
            linkedin:reqBody.linkedin,
            blog:reqBody.blog,
            facebook:reqBody.facebook
    });
    member.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('Member saved successfully');
        res.json({success: true});
    });
});
app.delete('/admin/deletemember/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deletemember request');
    Member.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.put('/admin/updatemember/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateuser request');
    var memberbody = req.body.body;
    var blogtags=req.body.tags;
    Member.findOneAndUpdate(
        {_id:objectId},
        {
            body:blogbody,
            tags:blogtags
        },function(err,article){
            if(err)throw err;
        });
});
app.get('/admin/retrievemembers', function(req, res){
    console.log('members get request');
    Members.find({},function(err,members){
        console.log(members);
        res.json(members);
    });
});
};