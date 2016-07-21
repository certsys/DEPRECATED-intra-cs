function editnews($scope, postService, $state) {
    $scope.title = "Newsfeed CS - Editar postagem";

    $scope.perfil = postService.getPost();
    console.log($scope.perfil);

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
    $scope.submit = function () {
        var data = {
            titulo: $scope.titulo
            , imagem: $scope.thumbnail.dataUrl
            , texto: $scope.texto
            , assinatura: $scope.assinatura
        };
        var output = angular.toJson(data);
        console.log(output);
        $http({
            method: 'POST'
            , url: '/posts'
            , data: output
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