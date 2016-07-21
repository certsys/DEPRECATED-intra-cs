function postManager($scope, $http, $state) {
    $http.get('/posts').then(function (response) {
        $scope.feed = response.data;
    }, console.log("Erro ao pegar os dados"));
    $scope.title = "Controle dos Posts";
    
    $scope.removePost = function (currentPost) {
        $http({
            method: 'DELETE'
            , url: '/posts/remove/' + currentPost._id
        }).then(function (response) {
            //your code in case the post succeeds

            console.log(response);
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });

        // $state.go('feed');
    }

    $scope.sendPost = function (currentPost) {
        console.log("Editar Post");
        postService.sendPost(currentPost);
    }
};
angular.module('inspinia').controller('postManager', postManager);