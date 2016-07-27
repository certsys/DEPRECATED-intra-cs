function loginCrtl($scope, $http, $state, userService) {
    $scope.title = "Login";

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
                $state.go('institucional');
            }
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });
    };

    $scope.logout = function () {
        console.log("Entrei na função logout!!!")
        userService.sendToken('Logout');
    };


};
angular.module('inspinia').controller('loginCrtl', loginCrtl);