var Blog = require('../models/blog');
var mongoose = require("mongoose");
module.exports = function(app){
//BLOG
// --------------------------------------------------------
app.delete('/admin/deleteblog/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('deleteblog request');
    Blog.find({_id:objectId}).remove(function(err,model){
        if(err){
            res.json('unable to remove');
        }else{
            res.json(model);
        }
    });
});
app.put('/admin/updateblog/:id',function(req,res){
    var id = req.params.id;
    var objectId = mongoose.Types.ObjectId(id);
    console.log('updateblog request');
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
app.post('/admin/postblog',function(req,res){
    var reqBody=req.body;
    var blog = new Blog({
            title:reqBody.title,
            body:reqBody.body,
            pictures:reqBody.pictures,
            reviews:[
            ],
            posttime:Date.now(),
            author:reqBody.author
    });
    blog.save(function(err){
        if(err){
            console.log(err);
            throw err;
        }
        console.log('Blog saved successfully');
        res.json({success: true});
    });
});
app.get('/retrieveblogs', function(req, res){
    console.log('blog get request');
    Blog.find({},function(err,blogs){
        console.log(blogs);
        res.json(blogs);
    });
});
app.get('/retrieveblogs/:title', function(req, res){
    var title = req.params.title;
    console.log('single blog get request');
    Blog.findOne({title:title},function(err,blog){
        res.json(blog);
    });
});


};
