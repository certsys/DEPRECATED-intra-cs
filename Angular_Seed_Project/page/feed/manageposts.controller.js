function postManager($scope, $http, postService, $state, userService, peopleGroups) {
    $http({
        url: '/posts/all',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        $scope.feed = response.data;
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });
    
    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores || userService.Authenticate().rh))
        $state.go('feed');

    $scope.title = "Controle dos Posts";

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

};
angular.module('inspinia').controller('postManager', postManager);