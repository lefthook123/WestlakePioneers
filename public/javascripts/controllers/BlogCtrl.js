(function(){
    'use strict';
}());
angular.module('WPApp')
//controller for partial-blogs.html
.controller('blogsController',function($scope,$http,$state){	
    $scope.pageClass = 'page-blogs';
    $scope.articles=[];
    var refresh = function(){
            $http.get('/retrieveblogs').success(function(response){
            $scope.articles = response;
            $scope.blog=null;
        });
    };
    refresh();
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.articles.length/$scope.pageSize);
    };
})
//controller for partial-blog-detail.html
.controller('blogsDetailController',function($scope,$http,$stateParams){ 
    $scope.pageClass = 'page-blogs';
    var title = $stateParams.blogTitle;
    $http.get('/retrieveblogs/'+title).success(function(response){
        $scope.selectedBlog = response;
    });
    $scope.replying=false;
    $scope.reply=function(){
        $scope.replying=true;
    };
    $scope.cancel=function(){
        $scope.replying=false;
    };
    $scope.postReply=function(){
    };
})
//controller for admin-blogs.html
.controller('adminblogsController',function($scope,$http){    
    var refresh = function(){
            $http.get('/retrieveblogs').success(function(response){
            $scope.articles = response;
            $scope.blog=null;
        });
    };
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.numberOfPages=function(){
        return Math.ceil($scope.articles.length/$scope.pageSize);
    };
    refresh();
    $scope.pageClass = 'page-blogs';    
    $scope.remove = function(id){
        $http.delete('/admin/deleteblog/'+id).success(function(response){
            refresh();
        });
    };
    $scope.addBlog=function(){
        $scope.blog.pictures = [];
        $scope.blog.pictures.push({'path': $scope.picturePaths});
        $http.post('/admin/postblog',$scope.blog).success(function(response){
            refresh();
        });
    };
    $scope.editing=false;
    $scope.edit = function(){
        $scope.editing=true;
    };
    $scope.cancel = function(){
        $scope.editing=false;
    };
    $scope.update = function(article){
        $scope.editing=false;
        $http.put('/admin/updateblog/'+article._id,article).success(function(response){
            refresh();
        });
    };
});