function insertnews($scope, $http, $timeout, $state, userService, peopleGroups) {
    $http({
        url: '/institucional',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });


    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if(!userService.isAdmin())
    //     $state.go('feed');

    $scope.today = new Date();
    $scope.title = "Newsfeed CS - Nova postagem";
    $scope.thumbnail = [];
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.dateHolder = new Date();
    $scope.selectedDate;
    $scope.wasPressed = false;


// Opções da Caixa de Texto do Corpo do Arquivo
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

    // Pega uma String do tipo dd/mm/aaaa hh:mm e transforma em ISODate
    $scope.changeDateToISO = function (date) {
        var dia = date.slice(0, 2);
        var mes = date.slice(3, 5);
        var ano = date.slice(6, 10);
        var hora = date.slice(11, 13);
        var horaBrasil = (parseInt(hora) + 3).toString();
        if (parseInt(hora) + 3 < 10)
            horaBrasil = "0" + horaBrasil;
        var minuto = date.slice(14, 16);
        // Exemplo de Date ISO: 2016-07-26T12:03:30Z
        var iso_date = ano + "-" + mes + "-" + dia + "T" + horaBrasil + ":" + minuto + ":00Z";
        $scope.selectedDate = new Date(iso_date);
    };

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
        var date;
        if ($scope.futuro == true) {
            date = angular.element('#data-postagem').val();
            $scope.changeDateToISO(date);
        }
        if ($scope.selectedDate <= $scope.today && $scope.futuro == true) {
                swal({
                    title: "OPS!",
                    text: "Data anterior a atual, corrija a data de postagem!",
                    type: "error",
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Ok",
                    closeOnConfirm: false
                });
                return;
        }
         else if ($scope.selectedDate >= $scope.today || $scope.futuro == false || angular.isUndefined($scope.futuro)) {
            if (!$scope.wasPressed) {
                $scope.wasPressed = true;
                var editions = [];
                if ($scope.futuro == true) {
                    // console.log("Data futura!!");
                    var date = angular.element('#data-postagem').val();
                    $scope.changeDateToISO(date);
                    if ($scope.selectedDate >= $scope.today) {
                        var data = {
                            titulo: $scope.titulo
                            , imagem: $scope.thumbnail.dataUrl
                            , texto: $scope.texto
                            , assinatura: $scope.assinatura
                            , editions: editions
                            , data: $scope.selectedDate
                            , sendBy: userService.getUser().displayName
                            , mala: $scope.mala
                        };
                    }
                    else {
                        swal({
                            title: "OPS!",
                            text: "Data anterior a atual, corrija a data de postagem!",
                            type: "error",
                            confirmButtonColor: "#DD6B55",
                            confirmButtonText: "Ok",
                            closeOnConfirm: false
                        });
                        return;
                    }
                }
                else {
                    // console.log("Data não futura!!");
                    var data = {
                        titulo: $scope.titulo
                        , imagem: $scope.thumbnail.dataUrl
                        , texto: $scope.texto
                        , assinatura: $scope.assinatura
                        , editions: editions
                        , sendBy: userService.getUser().displayName
                        , mala: $scope.mala
                    };
                }
                var output = angular.toJson(data);
                //
                var status;
                $http({
                    method: 'POST'
                    , url: '/posts'
                    , data: output
                    , params: {token: userService.getToken()}
                }).then(function (response) {
                        //your code in case the post succeeds
                        // console.log(response);
                        status = response.data.status;

                        swal({
                            title: "Sucesso!",
                            text: "Seu post foi inserido com sucesso!",
                            type: "success"
                        });
                        $state.go('manageposts');

                    }
                )
                    .catch(function (err) {
                        //your code in case your post fails
                        // console.log(err);
                    });


            }
        }
    }
}


angular.module('inspinia').controller('insertnews', insertnews);