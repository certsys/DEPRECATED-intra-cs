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

    $scope.subscribed = function (curso){
        var retorno = false;
        curso.inscritos.forEach(function(inscrito){

           if(inscrito === userService.getUser().sAMAccountName) retorno = true;
        });
        return retorno;
    };

    $scope.addSubscription = function (curso){
        curso.inscritos.push(userService.getUser().sAMAccountName);
        var data = {sAMAccountName: userService.getUser().sAMAccountName};
        $http({
            method: 'PUT'
            , url: '/cursos/addSubscription/' + curso._id
            , data: data
            , params: {token: userService.getToken()}
        }).then(function (response) {
            //your code in case the post succeeds
        }).catch(function (err) {
            // console.log(err);
        });
    };

    $scope.removeSubscription = function (curso){
        var index = curso.inscritos.indexOf(userService.getUser().sAMAccountName);
        if(index > -1) curso.inscritos.splice(index, 1);
        var data = {sAMAccountName: userService.getUser().sAMAccountName};
        $http({
            method: 'PUT'
            , url: '/cursos/removeSubscription/' + curso._id
            , data: data
            , params: {token: userService.getToken()}
        }).then(function (response) {
            //your code in case the post succeeds
        }).catch(function (err) {
            // console.log(err);
        });
    };
}


angular
    .module('inspinia')
    .controller('universidade', universidade);

