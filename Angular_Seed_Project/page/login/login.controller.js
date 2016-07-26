function loginCrtl($scope, $http) {
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
            console.log(response);
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });
    };


};
angular.module('inspinia').controller('loginCrtl', loginCrtl);