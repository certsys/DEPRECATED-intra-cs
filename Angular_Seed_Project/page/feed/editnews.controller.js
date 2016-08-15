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

    if (userService.devGroup()) $scope.permissions.debug = true;

    peopleGroups.GROUPS()
        .then(function (data) {
            if (angular.isDefined(data)) {
                if (userService.insideGroup(data[0].users)) $scope.permissions.admin = true;
                if (userService.insideGroup(data[4].users)) $scope.permissions.comercial = true;
                if (userService.insideGroup(data[2].users)) $scope.permissions.diretores = true;
                if (userService.insideGroup(data[3].users)) $scope.permissions.prevendas = true;
                if (userService.insideGroup(data[1].users)) $scope.permissions.tecnico = true;
            }
        }, function (error) {
            console.log('error', error);
        });

    if (!($scope.permissions.debug || $scope.permissions.admin || $scope.permissions.diretores))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if (!userService.isAdmin())
    //     $state.go('feed');

    $scope.title = "Newsfeed CS - Editar postagem";

    $scope.postagem = postService.getPost();

    $scope.thumbnail = [];

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
    $scope.edit = function () {
        if (angular.isDefined($scope.thumbnail) && angular.isDefined($scope.thumbnail.dataUrl)) {
            if ($scope.mala == true) {
                var usermail = angular.element('#usermail').val();
                var password = angular.element('#password').val();
                var data = {
                    titulo: $scope.postagem.titulo
                    , imagem: $scope.thumbnail.dataUrl
                    , texto: $scope.postagem.texto
                    , assinatura: $scope.postagem.assinatura
                    , sendBy: userService.getUser().displayName
                    , isDeleted: false
                    , usermail: usermail
                    , password: password
                };
            }
            else {
                var data = {
                    titulo: $scope.postagem.titulo
                    , imagem: $scope.thumbnail.dataUrl
                    , texto: $scope.postagem.texto
                    , sendBy: userService.getUser().displayName
                    , assinatura: $scope.postagem.assinatura
                    , isDeleted: false
                };
            }
        }
        else {
            if ($scope.mala == true) {
                var usermail = angular.element('#usermail').val();
                var password = angular.element('#password').val();
                var data = {
                    titulo: $scope.postagem.titulo
                    , imagem: null
                    , texto: $scope.postagem.texto
                    , sendBy: userService.getUser().displayName
                    , assinatura: $scope.postagem.assinatura
                    , isDeleted: false
                    , usermail: usermail
                    , password: password
                };
            }
            else {
                var data = {
                    titulo: $scope.postagem.titulo
                    , imagem: null
                    , texto: $scope.postagem.texto
                    , sendBy: userService.getUser().displayName
                    , assinatura: $scope.postagem.assinatura
                    , isDeleted: false
                };
            }
        }

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
            console.log(err);
        });
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
}

angular
    .module('inspinia')
    .controller('editnews', editnews);