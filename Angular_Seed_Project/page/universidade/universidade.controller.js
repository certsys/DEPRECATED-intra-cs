
function universidade($scope, $http, userService, $state, universidadeService, $modal) {
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

    $scope.title = "Universidade Certsys";

    $scope.subscribed = function (curso){
        var retorno = false;
        curso.inscritos.forEach(function(inscrito){


           if(inscrito === userService.getUser().sAMAccountName) retorno = true;
        });
        return retorno;
    };

    $scope.addSubscription = function (curso){
        curso.inscritos.push(userService.getUser().sAMAccountName);
    };

    $scope.removeSubscription = function (curso){
        var index = curso.inscritos.indexOf(userService.getUser().sAMAccountName);
        if(index > -1) curso.inscritos.splice(index, 1);
    };
}

angular
    .module('inspinia')
    .controller('universidade', universidade);





