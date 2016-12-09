/**
 * Created by marcos on 09/12/16.
 */
function gerenciar_recrutamentoCtrl($scope, $http, userService, fileUpload, $state, recrutamentoService) {
    $scope.participantes = [];
    $scope.loading = 0;
    $scope.isTodosDisabled = false;
    $scope.isInscritosDisabled = false;
    $scope.isSurveyShown = false;
    $scope.isSuveryInputDisabled = true;

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        $scope.todosContatos = response.data;
    }).catch(function (err) {
        $state.go('login');
    });

    $http({
        url: '/contacts/perfil',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        $scope.instrutor = response.data[0];
        if(response.data != null && response.data.length > 0) {
        } else {
            alert("Infelizmente o seu usuário ainda não tem dados no sistema :(");
        }
    }).catch(function (err) {
        $state.go('login');
    });

    $http({
        url: '/contacts/inscritos',
        method: "POST",
        params: {token: userService.getToken()},
        data: recrutamentoService.getVaga().inscritos
    }).then(function (response) {
        $scope.inscritos = response.data;
    }).catch(function (err) {
        $state.go('login');
    });

    $scope.vaga = recrutamentoService.getVaga();
    var dados = [];

    $scope.vaga.inscritos.forEach(function (inscrito) {
        if (inscrito.presente) dados.push(inscrito);
    });

    $scope.title = "Gerenciar Vaga | " + $scope.vaga.nome;
    var data_criacao = new Date($scope.vaga.data_criacao);
    var data_limite_inscricao = new Date($scope.vaga.data_limite_inscricao);
    $scope.dataCriacao = data_criacao.getDate() + '/' + (data_criacao.getMonth()+1) + '/' + data_criacao.getFullYear();
    $scope.dataLimite = data_limite_inscricao.getDate() + '/' + (data_limite_inscricao.getMonth()+1) + '/' + data_limite_inscricao.getFullYear() + ' - ' + data_limite_inscricao.getHours() + ':' + data_limite_inscricao.getMinutes() + '0';
    $scope.presentes = 0;
    $scope.vaga.inscritos.forEach(function(inscrito){
        if(inscrito.presente) $scope.presentes++;
    });

    $scope.apertei = false;

    $scope.pressionado = function () {
        $scope.apertei = true;
    };

    $scope.getDataInscricao = function (vaga, inscrito){
        for(var i = 0; i < vaga.inscritos.length; i++){
            if(vaga.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                return vaga.inscritos[i].data_inscricao;
            }
        }
    };

    $scope.conferirPresenca = function (vaga, inscrito) {
        for(var i = 0; i < vaga.inscritos.length; i++){
            if(vaga.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                return vaga.inscritos[i].presente;
            }
        }
    };

    $scope.marcarPresenca = function (vaga, inscrito) {
        for(var i = 0; i < vaga.inscritos.length; i++){
            if(vaga.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                vaga.inscritos[i].presente = !vaga.inscritos[i].presente;
                if (vaga.inscritos[i].presente) {
                    $scope.participantes.push(inscrito);
                    $scope.presentes++;
                }
                else {
                    $scope.participantes.splice(searchParticipanteIndex(inscrito), 1);
                    $scope.presentes--;
                }

                $http({
                    method: 'PUT'
                    , url: '/vagas/mudaPresenca/' + vaga._id
                    , data: vaga.inscritos[i]
                    , params: {token: userService.getToken()}
                }).then(function (response) {
                    //your code in case the post succeeds
                }).catch(function (err) {
                    // console.log(err);
                });
            }
        }
    };

    var searchParticipanteIndex = function (inscrito) {
        for (var i = 0; i < $scope.participantes.length; i++){
            if($scope.participantes[i].mail === inscrito.mail) return i;
        }
        return -1;
    };

    $scope.cargaHoraria = function () {
        var exactTime = $scope.vaga.carga_horaria;
        var hours = Math.floor(exactTime);
        var minutes = exactTime % 1;
        minutes = parseInt(minutes*60);
        var hourMinutes = hours + " hora(s) e " + minutes + " minuto(s)";
        return hourMinutes;
    }

    $scope.todosClick = function (){
        $scope.isSurveyShown = false;
        var todosContatos = $scope.todosContatos;
        var todosEmails ="";
        for (var i = 0 ; i <todosContatos.length ; i++) {
            todosEmails+= ";" + todosContatos[i].mail;
        }
        $scope.contatosMail = todosEmails;
        console.log(todosEmails)

    }

    $scope.inscritosClick = function () {
        $scope.isSurveyShown = false;
        var inscritos = $scope.inscritos;
        var inscritosEmail = "";
        for (var i = 0 ; i <inscritos.length ; i++) {
            inscritosEmail+= ";" + inscritos[i].mail;
        }
        $scope.contatosMail = inscritosEmail;
        console.log(inscritosEmail)

    }
}

angular
    .module('inspinia')
    .directive('fileModel', fileModel )
    .service('fileUpload', fileUpload)
    .controller('gerenciar_recrutamentoCtrl', gerenciar_recrutamentoCtrl);



