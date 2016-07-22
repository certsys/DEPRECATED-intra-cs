function editnews($http, $scope, postService, $state, $timeout) {
    $scope.title = "Newsfeed CS - Editar postagem";

    $scope.postagem = postService.getPost();
    console.log($scope.postagem);

    $scope.thumbnail = [];
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
            console.log("IF 1");
            var data = {
                titulo: $scope.postagem.titulo
                , imagem: $scope.thumbnail.dataUrl
                , texto: $scope.postagem.texto
                , assinatura: $scope.postagem.assinatura
            };
        }
        else {
            console.log("IF 2");
            var data = {
                titulo: $scope.postagem.titulo
                , imagem: null
                , texto: $scope.postagem.texto
                , assinatura: $scope.postagem.assinatura
            };
        }
        console.log($scope.thumbnail.dataUrl);
        $http({
            method: 'PUT'
            , url: '/posts/edit/' + $scope.postagem._id
            , data: data
        }).then(function (response) {
            //your code in case the post succeeds
            console.log(response);
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });
        $state.go('manageposts');
    }

    $scope.options = {
        text : ""
        , height: 300
        , toolbar: [
            ['style', ['style', 'bold', 'italic', 'underline', 'clear']]
            , ['color', ['color']]
            , ['view', ['fullscreen', 'codeview']]
            , ['table', ['table']]
            , ['para', ['ul', 'ol', 'paragraph']]
            , ['height', ['height']]
        ]
    };
}

angular
    .module('inspinia')
    .controller('editnews', editnews);