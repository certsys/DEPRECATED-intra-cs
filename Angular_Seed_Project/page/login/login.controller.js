function loginCrtl($scope, $http, $state, userService) {
    $scope.title = "Login";

    $http({
        url: '/posts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        // console.log(response);
        $state.go('feed');
    }).catch(function (err) {
        // console.log(err);
    });

    $scope.incorrectData = function () {
        swal({
            title: "OPS!",
            text: "Usuário e/ou senha inválida!",
            type: "error",
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            closeOnConfirm: false
        });
    };
        // $state.go('feed');
    $scope.login = function () {
        var data = {
            username: $scope.username + '@certsys.local',
            password: $scope.password
        };

        var output = JSON.stringify(data);
        $http({
            method: 'POST'
            , url: '/login'
            , data: output
        }).then(function (response) {
            //your code in case the post succeeds
            // console.log(response.data.token);
            // console.log(response.data.user);
            if (response.data.user) {
                userService.sendUser(response.data.user);
                userService.sendToken(response.data.token);
                $state.go('feed');
            } else {
                // console.log(response.data);
                $scope.incorrectData();
            }
        }).catch(function (err) {
            //your code in case your post fails
            // console.log(err);
        });
    };

    $scope.logout = function () {
        userService.sendToken('Logout');
    };


};
angular.module('inspinia').controller('loginCrtl', loginCrtl);