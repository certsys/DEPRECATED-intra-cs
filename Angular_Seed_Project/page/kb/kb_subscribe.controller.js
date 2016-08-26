function kbSubscribeCtrl($scope, $http, $state, userService) {

    $http({
        url: '/kb',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        console.log(response);
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    $scope.title = "Inserir novo item";

    
}

angular.module('inspinia').controller('kbSubscribeCtrl', kbSubscribeCtrl);