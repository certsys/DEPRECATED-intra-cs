function postManager($scope, $http, postService, $state, userService, peopleGroups) {
    $scope.feed =[];
    $scope.title = "Controle dos Posts";
    var skip = 0;
    const skipSum = 5;
    const limitPerLoad = 5;
    var previousResult;

    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores || userService.Authenticate().rh))
        $state.go('feed');

    $scope.loadMore = function () {
        $http({
            url: '/posts/all',
            method: "GET",
            params: {token: userService.getToken(), skip: skip, limit: limitPerLoad}
        }).then(function (response) {
            //your code in case the post succeeds
            //$scope.feed = response.data;
            var result = response.data;
            if(!compareResults(result, previousResult)) return;
            previousResult = result;

            $scope.feed = $scope.feed.concat(result);
            skip = skip + skipSum;
        }).catch(function (err) {
            $state.go('login');
            // console.log(err);
        });

        // compara busca no database anterior com a atual, se igual é porque o backend retornou mesmo array
        // entao NAO é adicionado no $scope.feed para nao ter redundancia
        function compareResults (current, previous) {
            if (previous == undefined) return true;

            var arraySize = limitPerLoad-1;
            for (var i = 0; i < arraySize; i++) {
                if (current[i]._id == previous[i]._id) {
                    return false;
                }
            }
            return true
        }
    };

    $scope.removePost = function (currentPost) {
        swal({
            title: "Você tem certeza?",
            text: "Você ainda poderá recuperar esse post!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false
        }, function () {
            $http({
                method: 'DELETE'
                , url: '/posts/remove/' + currentPost._id
                , params: {token: userService.getToken()}
            }).then(function (response) {
                //your code in case the post succeeds
                setTimeout(function () {
                    // after 1500ms, reloads the page to refresh the courses table
                    location.reload()
                }, 1000);
                // console.log(response);
            }).catch(function (err) {
                //your code in case your post fails
                // console.log(err);
            });
            swal("Deletado!", "O Post foi deletado com sucesso!", "success");
        });


        // $state.go('feed');
    }

    $scope.sendPost = function (currentPost) {
        postService.sendPost(currentPost);
    };

    $scope.isEmpty = function (array) { // Printa histórico de edições apenas se houver edições!!!
        if (array.length > 0) return true;
        return false;
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
angular.module('inspinia').controller('postManager', postManager);