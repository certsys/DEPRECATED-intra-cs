function editnews($http, $scope, postService, $state, $timeout, userService, peopleGroups) {
    $http({
        url: '/institucional',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response);
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });


    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores || userService.Authenticate().rh))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if (!userService.isAdmin())
    //     $state.go('feed');

    $scope.title = "Newsfeed CS - Editar postagem";

    $scope.postagem = postService.getPost();

    $scope.thumbnail = [];

    $scope.wasPressed = false;

    $scope.noImage = function () {
        if ($scope.thumbnail.length) return true;
        return false;
    }

    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function (files) {
        if (files != null) {
            var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function () {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file); // convert the image to data url.
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.thumbnail.dataUrl = e.target.result; // Retrieve the im  age.
                        });
                    }
                });
            }
        }
    };


    $scope.options = {
        text: ""
        , height: 300
        , toolbar: [
            ['style', ['style', 'bold', 'italic', 'underline', 'clear']]
            , ['color', ['color']]
            , ['para', ['ul', 'ol', 'paragraph']]
            , ['table', ['table']]
            , ['insert', ['link', 'hr']]
            , ['view', ['fullscreen', 'codeview']]
        ]
    };


    $scope.edit = function () {
        if (!$scope.wasPressed) {
            $scope.wasPressed = true;
            var imagem = null;
            if (angular.isDefined($scope.thumbnail) && angular.isDefined($scope.thumbnail.dataUrl))
                imagem = $scope.thumbnail.dataUrl;

            var data = {
                titulo: $scope.postagem.titulo
                , imagem: imagem
                , texto: $scope.postagem.texto
                , sendBy: userService.getUser().displayName
                , assinatura: $scope.postagem.assinatura
                , isDeleted: false
                , mala: $scope.mala
            };
            var status;
            $http({
                method: 'PUT'
                , url: '/posts/edit/' + $scope.postagem._id
                , data: data
                , params: {token: userService.getToken()}
            }).then(function (response) {
                status = response.data.status;
                if (angular.isDefined(response.data.mail)) {
                    if (!status) {
                        swal({
                            title: "OPS!",
                            text: "Usuário e/ou Senha Inválidos!",
                            type: "error",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Ok",
                            closeOnConfirm: false
                        });
                    } else {
                        swal({
                            title: "Sucesso!",
                            text: "Seu post foi editado com sucesso!",
                            type: "success"
                        });
                        $state.go('manageposts');
                    }
                }
                else {
                    swal({
                        title: "Sucesso!",
                        text: "Seu post foi editado com sucesso!",
                        type: "success"
                    });
                    $state.go('manageposts');
                }
            }).catch(function (err) {
                //your code in case your post fails
                // console.log(err);
            });
        }

    }
}

angular
    .module('inspinia')
    .controller('editnews', editnews);