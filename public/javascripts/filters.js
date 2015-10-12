(function(){
    'use strict';
}());
angular.module('WPApp')
.filter('startFrom', function() {
    return function(input, start) {
    	if(input){
    		start = +start; //parse to int
        	return input.slice(start);
    	}
    	return [];
        
    };
})
.filter('breakFilter',function(){
	return function(text){
		if(text!==undefined){
			return text.replace(/\n/g,'<br />');
		}
	};
})
.filter('parseUrl',function($sce){
    var urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
    var emails = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
    return function(text){
        if(text.match(urls)){
            text = text.replace(urls,'<a href="$1">$1</a>');
        }
        if(text.match(emails)){
            text = text.replace(emails, '<a href=\"mailto:$1\">$1</a>');
        }
        return $sce.trustAsHtml(text);
    };
});