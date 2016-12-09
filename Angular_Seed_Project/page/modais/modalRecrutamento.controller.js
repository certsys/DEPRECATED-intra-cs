/**
 * Created by marcos on 24/11/16.
 */
function modalRecrutamentoCtrl($scope, $modalInstance, $http, userService, getVaga, recrutamentoService, $state) {

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        $scope.contatos = response.data;
    }).catch(function (err) {
        console.log(err);
    });

    recrutamentoService.sendSalvou(false);
    $scope.editar = false;
    // Se o modal vier com dados pré cadastrados
    if (angular.isDefined(getVaga)) {
        $scope.editar = true;
        $http({
            url: '/contacts/perfil',
            method: "GET",
            params: {token: userService.getToken()}
        }).then(function (response) {
            //your code in case the post succeeds
            $scope.titulo = getVaga.nome;
            $scope.descricao = getVaga.descricao;
            $scope.local = getVaga.local;
            $scope.minInscritos = getVaga.min_inscritos;
            $scope.maxInscritos = getVaga.max_inscritos;
            // var data_inicio = new Date(getVaga.data_inicio);
            // var data_fim = new Date(getVaga.data_fim);
            // $scope.diaInicio = data_inicio;
            // $scope.horarioInicio = data_inicio.getHours() + ":" + data_inicio.getMinutes();
            // $scope.horarioFim = data_fim.getHours() + ":" + data_fim.getMinutes();
            $scope.dataLimiteInscricao = new Date(getVaga.data_limite_inscricao);
            // $scope.selected = response.data[0];
        }).catch(function (err) {
            // console.log(err);
        });

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

    $scope.gerenciar = function () {
        if (angular.isDefined(getVaga)) {
            recrutamentoService.sendVaga(getVaga);
            $state.go('recrutamento_manage');
            $modalInstance.close();

        }
    };

    $scope.isCreated = function () {
        return (angular.isDefined(getVaga));
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
    var criarDataLimiteInscricao = function (date) {
        var dia = date.slice(0, 2);
        var mes = date.slice(3, 5);
        var ano = date.slice(6, 10);
        var hora = date.slice(11, 13);
        var minuto = date.slice(14, 16);
        $scope.dataLimiteInscricao = new Date(ano, mes - 1, dia, hora, minuto);
    };

    $scope.salvar = function () {

        //if (angular.isUndefined($scope.selected)) return;
        //var sAMAccountName = $scope.selected.mail.substring(0, $scope.selected.mail.indexOf('@'));
        // var instrutor = {
        //     _id: $scope.selected._id,
        //     sAMAccountName: sAMAccountName
        // };
       // criarDatas(angular.element('#data-inicio').val(), $scope.horarioInicio, $scope.horarioFim);
        criarDataLimiteInscricao(angular.element('#data-limite-inscricao').val());

        var data = {
            nome: $scope.titulo,
            descricao: $scope.descricao,
            local: $scope.local,
            // data_inicio: $scope.dataInicial,
            // data_fim: $scope.dataFinal,
            data_limite_inscricao: $scope.dataLimiteInscricao,
            min_inscritos: $scope.minInscritos,
            max_inscritos: $scope.maxInscritos,
            created_by: userService.getUser().sAMAccountName,
            // instrutor: instrutor,
            carga_horaria: $scope.cargaHoraria
        };


        if ($scope.editar) {
            $http({
                method: 'PUT'
                , url: '/vagas/edit/' + getVaga._id
                , data: data
                , params: {token: userService.getToken()}
            }).then(function (response) {
                    swal({
                        title: "Sucesso!",
                        text: "Seu curso foi editado com sucesso!",
                        type: "success"
                    });

                    recrutamentoService.sendSalvou(true);
                    $modalInstance.close();
                    setTimeout(function () {
                        location.reload()
                    }, 1000);

                }
            )
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            $http({
                method: 'POST'
                , url: '/vagas'
                , data: data
                , params: {token: userService.getToken()}
            }).then(function (response) {
                    swal({
                        title: "Sucesso!",
                        text: "Seu curso foi criado com sucesso!",
                        type: "success"
                    });

                    recrutamentoService.sendSalvou(true);
                    $modalInstance.close();
                    setTimeout(function () {
                        location.reload()
                    }, 1000);

                }
            )
                .catch(function (err) {
                    console.log(err);
                });
        }
    };

    $scope.remove = function () {

        swal({
            title: "Você tem certeza?",
            text: "Você não poderá recuperar esse curso!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Deletar!",
            closeOnConfirm: false
        }, function () {
            $http({
                method: 'DELETE'
                , url: '/vagas/remove/' + getVaga._id
                , params: {token: userService.getToken()}
            }).then(function (response) {
                swal({
                    title: "Removido!",
                    text: "Curso removido com sucesso.",
                    type: "success",
                    showConfirmButton: false
                });
                setTimeout(function () {
                    location.reload()
                }, 1000);

            }).catch(function (err) {
                console.log(err);
            });
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
    .controller('modalRecrutamentoCtrl', ['getVaga', modalRecrutamentoCtrl]);