function feed($scope, $http) {
    var today = new Date();

    $scope.isToday = function (date) {
    	console.log(today);
    	console.log(date);
    	return true;
    }

    $http.get('/posts').then(function (response) {
        $scope.feed = response.data;
    }, console.log("Erro ao pegar os dados"));
    $scope.title = "Newsfeed Certsys";
    $scope.limit = 1;
    $scope.loadMore = function () {
        $scope.limit = $scope.limit + 1;
    };
};
angular.module('inspinia').controller('feed', feed);