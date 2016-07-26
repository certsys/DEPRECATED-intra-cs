function feed($scope, $http) {
    var today = new Date();

    $scope.isToday = function (date) {
        // console.log(today);
        var data = new Date(date);
        // console.log(data);
        if (data < today)
            return true;
        return false;
    }

    $http.get('/posts').then(function (response) {
        $scope.feed = response.data;
    }, console.log("Erro ao pegar os dados"));
    $scope.title = "Newsfeed Certsys";
    $scope.limit = 4; // TODO: Problema se a pessoa agendar 5 posts!!!

    $scope.loadMore = function () {
        $scope.limit = $scope.limit + 1;
    };
};
angular.module('inspinia').controller('feed', feed);