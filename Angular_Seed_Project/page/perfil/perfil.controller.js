function perfil_ctrl($scope, contactService, $state, $http, userService) {
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

    $scope.perfil=contactService.getContact();
    console.log($scope.perfil)
}

angular
    .module('inspinia')
    .controller('perfil_ctrl', perfil_ctrl);