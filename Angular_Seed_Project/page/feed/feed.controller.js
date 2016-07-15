function feed($scope, $http){
	$http.get('/posts').then(function(response) {
		$scope.feed = response.data;
	}, console.log("Erro ao pegar os dados"));

	$scope.title = "Newsfeed Certsys";
};

angular
    .module('inspinia')
   .controller('feed',feed);

