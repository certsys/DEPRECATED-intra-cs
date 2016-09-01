function ModalInstanceCtrl($scope, $modalInstance, $http, userService, getCurso, universidadeService) {

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
    universidadeService.sendSalvou(false);
    $scope.editar = false;
    // Se o modal vier com dados pré cadastrados
    if (angular.isDefined(getCurso)) {
        $scope.editar = true;
        $http({
            url: '/contacts/perfil',
            method: "GET",
            params: {token: userService.getToken(), mail: getCurso.instrutor.sAMAccountName}
        }).then(function (response) {
            //your code in case the post succeeds
            // console.log(response.data.lenght > 0);
            $scope.titulo = getCurso.nome;
            $scope.descricao = getCurso.descricao;
            $scope.local = getCurso.local;
            $scope.minInscritos = getCurso.min_inscritos;
            $scope.maxInscritos = getCurso.max_inscritos;
            var data_inicio = new Date(getCurso.data_inicio);
            var data_fim = new Date(getCurso.data_fim);
            $scope.diaInicio = data_inicio;
            $scope.horarioInicio = data_inicio.getHours() + ":" + data_inicio.getMinutes();
            $scope.horarioFim = data_fim.getHours() + ":" + data_fim.getMinutes();
            $scope.dataLimiteInscricao = new Date(getCurso.data_limite_inscricao);
            $scope.selected = response.data[0];
        }).catch(function (err) {
            // console.log(err);
        });
        //     instrutor: instrutor,
    } else {
        $scope.minInscritos = 0;
        $scope.maxInscritos = 0;
        $scope.diaInicio = new Date();
    }


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
        $scope.dataInicial = new Date(ano, mes - 1, dia, horaInicio, minutoInicio);
        $scope.dataFinal = new Date(ano, mes - 1, dia, horaFim, minutoFim);
        $scope.cargaHoraria = ($scope.dataFinal.getHours() - $scope.dataInicial.getHours()) + (($scope.dataFinal.getMinutes() - $scope.dataInicial.getMinutes()) / 60);
    };

    // Pega uma String do tipo dd/mm/aaaa hh:mm e transforma em ISODate
    var changeDateToISO = function (date) {
        var dia = date.slice(0, 2);
        var mes = date.slice(3, 5);
        var ano = date.slice(6, 10);
        var hora = date.slice(11, 13);
        var minuto = date.slice(14, 16);
        $scope.dataLimiteInscricao = new Date(ano, mes - 1, dia, hora, minuto);
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


        if ($scope.editar) {
            $http({
                method: 'PUT'
                , url: '/cursos/edit/' + getCurso._id
                , data: data
                , params: {token: userService.getToken()}
            }).then(function (response) {
                    //your code in case the post succeeds
                    // console.log(response);
                    swal({
                        title: "Sucesso!",
                        text: "Seu curso foi editado com sucesso!",
                        type: "success"
                    });

                    universidadeService.sendSalvou(true);
                    $modalInstance.close();

                }
            )
                .catch(function (err) {
                    //your code in case your post fails
                    // console.log(err);
                });
        } else {
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

                    universidadeService.sendSalvou(true);
                    $modalInstance.close();

                }
            )
                .catch(function (err) {
                    //your code in case your post fails
                    // console.log(err);
                });
        }


    };


};


angular
    .module('inspinia')
    .controller('ModalInstanceCtrl', ['getCurso', ModalInstanceCtrl]);