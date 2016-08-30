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

	$scope.permissions = {
		debug: false,
		admin: false,
		comercial: false,
		diretores: false,
		prevendas: false,
		tecnico: false,
		instructors: false
	};

	if(userService.instructorGroup()) $scope.permissions.instructors = true;
}


angular
    .module('inspinia')
    .controller('universidade', universidade);

