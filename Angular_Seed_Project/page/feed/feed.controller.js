function feed($scope, $http, $state, $sce, userService) {
    $scope.feed =[];
    $scope.title = "Newsfeed Certsys";
    var skip = 0;
    const skipSum = 5;
    const limitPerLoad = 5;
    var previousResult;

    var today = new Date();

    $scope.isToday = function (date) {
        // console.log(today);
        var data = new Date(date);
        // console.log(data);
        if (data < today)
            return true;
        return false;
    };

    $scope.loadMore = function () {
        $http({
            url: '/posts',
            method: "GET",
            params: {token: userService.getToken(), skip: skip, limit: limitPerLoad}
        }).then(function (response) {
            //your code in case the post succeeds
            var result = response.data;
            console.log(result)
            if(!compareResults(result, previousResult)) {
                return
            }
            previousResult = result;

            result.forEach(function(postagem) {
                postagem.texto = $sce.trustAsHtml(postagem.texto);
            });
            $scope.feed = $scope.feed.concat(result);
            skip = skip + skipSum;
        }).catch(function (err) {
            $state.go('login');
        });

        // compara busca no database anterior com a atual, se igual é porque o backend retornou mesmo array
        // entao NAO é adicionado no $scope.feed para nao ter redundancia
        function compareResults (current, previous) {
            if (previous == undefined) return true;

            var arraySize = limitPerLoad-1;
            for (var i = 0; i < arraySize; i++) {
                if (!current[i]) return false; // se ja leu todos os posts
                if (current[i]._id == previous[i]._id) {
                    return false;
                }
            }
            return true
        }
    };

    $scope.checkFilteredFeedSize = function() {
        setTimeout(function () {
            if ($scope.feed.length == 0) {
                return true;
            } else {
                return false;
            }
        }, 2000)
    }
};

angular.module('inspinia').controller('feed', feed);