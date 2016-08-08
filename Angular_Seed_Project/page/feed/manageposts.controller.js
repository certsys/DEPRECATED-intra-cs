function postManager($scope, $http, postService, $state, userService, peopleGroups) {
    $http({
        url: '/posts/all',
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

    $scope.permissions = {
        debug: false,
        admin: false,
        comercial: false,
        diretores: false,
        prevendas: false,
        tecnico: false
    };

    if(userService.devGroup()) $scope.permissions.debug = true;

    peopleGroups.GROUPS()
        .then(function(data) {
            if(angular.isDefined(data)) {
                console.log(data);
                if (userService.insideGroup(data[0].users)) $scope.permissions.admin = true;
                if (userService.insideGroup(data[4].users)) $scope.permissions.comercial = true;
                if (userService.insideGroup(data[2].users)) $scope.permissions.diretores = true;
                if (userService.insideGroup(data[3].users)) $scope.permissions.prevendas = true;
                if (userService.insideGroup(data[1].users)) $scope.permissions.tecnico = true;
            }
        }, function(error){
            console.log('error', error);
        });

    if(!($scope.permissions.debug || $scope.permissions.admin || $scope.permissions.diretores))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if(!userService.isAdmin())
    //     $state.go('feed');


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
                , params: {token: userService.getToken()}
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
        postService.sendPost(currentPost);
    };

    $scope.isEmpty = function (array) { // Printa histórico de edições apenas se houver edições!!!
        if (array.length > 0) return true;
        return false;
    };

};
angular.module('inspinia').controller('postManager', postManager);