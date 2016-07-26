function insertnews($scope, $http, $timeout, $state) {
    $scope.today = new Date();
    $scope.title = "Newsfeed CS - Nova postagem";
    $scope.thumbnail = [];
    $scope.fileReaderSupported = window.FileReader != null
    $scope.dateHolder = new Date();
    $scope.selectedDate;

    // $scope.$watch('dateHolder', function(newValue, oldValue) {
    //     console.log('dateHolder changed', oldValue, newValue);
    // }, true);


    $scope.photoChanged = function (files) {
        if (files != null) {
            var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function () {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file); // convert the image to data url. 
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.thumbnail.dataUrl = e.target.result; // Retrieve the image.
                        });
                    }
                });
            }
        }
    };
    $scope.submit = function () {
            var editions = [];
            if ($scope.futuro == true) {
                var date = angular.element('#data-postagem').val();
                $scope.changeDateToISO(date);
                var data = {
                    titulo: $scope.titulo
                    , imagem: $scope.thumbnail.dataUrl
                    , texto: $scope.texto
                    , assinatura: $scope.assinatura
                    , editions: editions
                    , data: $scope.selectedDate
                };
            }
            else {
                var data = {
                    titulo: $scope.titulo
                    , imagem: $scope.thumbnail.dataUrl
                    , texto: $scope.texto
                    , assinatura: $scope.assinatura
                    , editions: editions
                };   
            }
            var output = angular.toJson(data);
            // console.log(output);
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
            $state.go('feed');
        }
        // Opções da Caixa de Texto do Corpo do Arquivo
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

    // Pega uma String do tipo dd/mm/aaaa hh:mm e transforma em ISODate
    $scope.changeDateToISO = function (date) {
        var dia = date.slice(0, 2);
        var mes = date.slice(3, 5);
        var ano = date.slice(6, 10);
        var hora = date.slice(11, 13);
        var horaBrasil = (parseInt(hora) + 3).toString();
        var minuto = date.slice(14, 16);
        // Exemplo de Date ISO: 2016-07-26T12:03:30Z
        var iso_date = ano + "-" + mes + "-" + dia + "T" + horaBrasil + ":" + minuto + ":00Z";
        $scope.selectedDate = new Date(iso_date);
    };

};

angular.module('inspinia').controller('insertnews', insertnews);