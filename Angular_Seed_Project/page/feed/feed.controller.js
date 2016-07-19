function feed($scope, $http) {
    $http.get('/posts').then(function (response) {
        $scope.feed = response.data;
    }, console.log("Erro ao pegar os dados"));
    $scope.title = "Newsfeed Certsys";
    $scope.limit = 1;
    $scope.loadMore = function () {
        console.log($scope.limit);
        $scope.limit = $scope.limit + 1;
    };
};
angular.module('inspinia').controller('feed', feed);