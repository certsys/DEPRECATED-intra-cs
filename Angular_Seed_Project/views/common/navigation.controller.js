function navigationCrtl($scope, $state, userService) {

    $scope.logout = function () {
        console.log("Entrei na função logout!!!")
        userService.sendToken('Logout');
        $state.go('login');
    };


}
angular.module('inspinia').controller('navigationCrtl', navigationCrtl);