function universidade($scope, $http, userService, $state, $modal) {
	$http({
		url: '/institucional',
		method: "GET",
		params: {token: userService.getToken()}
	}).then(function (response) {
		//your code in case the post succeeds
		// console.log(response);
	}).catch(function (err) {
		$state.go('login');
		// console.log(err);
	});


    $scope.title = "universidade";

 	
};

angular
    .module('inspinia')
    .controller('universidade', universidade);





