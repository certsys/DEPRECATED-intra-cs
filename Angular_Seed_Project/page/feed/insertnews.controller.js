function insertnews($scope, $http, $timeout, $state, userService, peopleGroups) {
    $http({
        url: '/institucional',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
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
                console.log("Data futura!!");
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
                console.log("Data não futura!!");
                var data = {
                    titulo: $scope.titulo
                    , imagem: $scope.thumbnail.dataUrl
                    , texto: $scope.texto
                    , assinatura: $scope.assinatura
                    , editions: editions
                    , sendBy: userService.getUser().displayName
                };
            }
            var output = angular.toJson(data);
            // console.log(output);
            $http({
                method: 'POST'
                , url: '/posts'
                , data: output
                , params: {token: userService.getToken()}
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