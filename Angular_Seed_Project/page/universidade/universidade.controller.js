function universidade($scope, $http, userService, $state, universidadeService) {
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

	$scope.curso=universidadeService.getCurso()
    $scope.title = "universidade";

};


angular
    .module('inspinia')
    .controller('universidade', universidade);

