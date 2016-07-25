function postManager($scope, $http, postService) {
    $http.get('/posts').then(function (response) {
        $scope.feed = response.data;
    }, console.log("Erro ao pegar os dados"));
    $scope.title = "Controle dos Posts";

    $scope.removePost = function (currentPost) {
        swal({
            title: "Você tem certeza?",
            text: "Você não poderá recuperar esse post!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false
        }, function () {
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
            swal("Deletado!", "O Post foi deletado com sucesso!", "success");
            var index = $scope.feed.indexOf(currentPost);
            $scope.feed.splice(index, 1);
        });


        // $state.go('feed');
    }

    $scope.sendPost = function (currentPost) {
        console.log("Editar Post");
        postService.sendPost(currentPost);
    };

    $scope.isEmpty = function (array) { // Printa histórico de edições apenas se houver edições!!!
        if (array.length > 0) return true;
        return false;
    };

};
angular.module('inspinia').controller('postManager', postManager);