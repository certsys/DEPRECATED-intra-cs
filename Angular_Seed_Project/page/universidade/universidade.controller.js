function universidade($scope, $http, userService, $state) {

    $http({
		url: '/cursos',
		method: "GET",
		params: {token: userService.getToken()}
	}).then(function (response) {
		//your code in case the post succeeds
		$scope.cursos = response.data;
	}).catch(function (err) {
		$state.go('login');
		// console.log(err);
	});

    $scope.title = "Universidade Certsys";
}


angular
    .module('inspinia')
    .controller('universidade', universidade);

