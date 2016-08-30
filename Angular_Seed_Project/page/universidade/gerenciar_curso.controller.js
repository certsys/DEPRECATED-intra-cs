function gerenciar_curso($scope, $http, userService, $state) {
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

    $scope.title = "Gerenciar curso | ";
    $scope.curso;
    
};


angular
    .module('inspinia')
    .controller('gerenciar_curso', gerenciar_curso);

