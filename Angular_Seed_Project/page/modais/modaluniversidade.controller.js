function modalDemoCtrl($scope, $modal) {

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'page/modais/modalUniversidade.html',
            controller: ModalInstanceCtrl,
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'datePicker',
                            files: ['js/plugins/moment/moment.min.js', 'css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            name: 'pasvaz.bindonce',
                            files: ['js/plugins/bindonce/bindonce.min.js']
                        },
                        {
                            files: ['css/plugins/clockpicker/clockpicker.css', 'js/plugins/clockpicker/clockpicker.js']
                        },
                        {
                            files: ['css/plugins/sweetalert/sweetalert.css', 'js/plugins/sweetalert/sweetalert.min.js']
                        }
                    ]);
                }
            }
        });
    }

};

function ModalInstanceCtrl($scope, $modalInstance, $http, userService) {

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        $scope.contatos = response.data;
    }).catch(function (err) {
        // console.log(err);
    });

    $scope.minInscritos = 0;

    $scope.maxInscritos = 0;

    $scope.onChangeMinimo = function () {
        if ($scope.minInscritos > $scope.maxInscritos) $scope.maxInscritos = $scope.minInscritos;
    };

    $scope.onChangeMaximo = function () {
        if ($scope.minInscritos > $scope.maxInscritos) $scope.minInscritos = $scope.maxInscritos;
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    var criarDatas = function (date, horarioInicio, horarioFim) {
        var dia = date.slice(0, 2);
        var mes = date.slice(3, 5);
        var ano = date.slice(6, 10);
        var horaInicio = horarioInicio.slice(0, 2);
        var minutoInicio = horarioInicio.slice(3, 5);
        var horaFim = horarioFim.slice(0, 2);
        var minutoFim = horarioFim.slice(3, 5);
        $scope.dataInicial = new Date(ano, mes-1, dia, horaInicio, minutoInicio);
        $scope.dataFinal = new Date(ano, mes-1, dia, horaFim, minutoFim);
        $scope.cargaHoraria = ($scope.dataFinal.getHours() - $scope.dataInicial.getHours()) + (($scope.dataFinal.getMinutes() - $scope.dataInicial.getMinutes()) / 60);
    };

    // Pega uma String do tipo dd/mm/aaaa hh:mm e transforma em ISODate
    var changeDateToISO = function (date) {
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
        $scope.dataLimiteInscricao = new Date(iso_date);
    };

    $scope.salvar = function () {

        if (angular.isUndefined($scope.selected)) return;
        var sAMAccountName = $scope.selected.mail.substring(0, $scope.selected.mail.indexOf('@'));
        var instrutor = {
            _id: $scope.selected._id,
            sAMAccountName: sAMAccountName
        };

        criarDatas(angular.element('#data-inicio').val(), $scope.horarioInicio, $scope.horarioFim);
        changeDateToISO(angular.element('#data-limite-inscricao').val());

        var data = {
            nome: $scope.titulo,
            descricao: $scope.descricao,
            local: $scope.local,
            data_inicio: $scope.dataInicial,
            data_fim: $scope.dataFinal,
            data_limite_inscricao: $scope.dataLimiteInscricao,
            min_inscritos: $scope.minInscritos,
            max_inscritos: $scope.maxInscritos,
            created_by: userService.getUser().sAMAccountName,
            instrutor: instrutor,
            carga_horaria: $scope.cargaHoraria
        };

        $http({
            method: 'POST'
            , url: '/cursos'
            , data: data
            , params: {token: userService.getToken()}
        }).then(function (response) {
                //your code in case the post succeeds
                // console.log(response);
                swal({
                    title: "Sucesso!",
                    text: "Seu curso foi criado com sucesso!",
                    type: "success"
                });

                $modalInstance.close();

            }
        )
            .catch(function (err) {
                //your code in case your post fails
                // console.log(err);
            });
    };


};


angular
    .module('inspinia')
    .controller('modalDemoCtrl', modalDemoCtrl)
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);