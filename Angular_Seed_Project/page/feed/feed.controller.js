function feed($scope, $http, $state, userService) {
    $http({
        url: '/posts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        $scope.feed = response.data;
        console.log(response);
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    var today = new Date();

    $scope.isToday = function (date) {
        // console.log(today);
        var data = new Date(date);
        // console.log(data);
        if (data < today)
            return true;
        return false;
    }

    $scope.title = "Newsfeed Certsys";
    $scope.limit = 2;

    $scope.loadMore = function () {
        $scope.limit = $scope.limit + 1;
    };
};
angular.module('inspinia').controller('feed', feed);