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
});