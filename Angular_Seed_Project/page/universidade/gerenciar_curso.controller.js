function gerenciar_curso($scope, $http, userService, fileUpload, $state, universidadeService) {
    $scope.participantes = [];
    $scope.loading = 0;
    $scope.isTodosDisabled = false;
    $scope.isInscritosDisabled = false;
    $scope.isSurveyShown = false;
    $scope.isSuveryInputDisabled = true

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response.data.lenght > 0);
        $scope.todosContatos = response.data;
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    $http({
        url: '/contacts/perfil',
        method: "GET",
        params: {token: userService.getToken(), mail: universidadeService.getCurso().instrutor.sAMAccountName}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response.data.lenght > 0);
        $scope.instrutor = response.data[0];
        if(response.data != null && response.data.length > 0) {
        } else {
            alert("Infelizmente o seu usuário ainda não tem dados no sistema :(");
        }
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    $http({
        url: '/contacts/inscritos',
        method: "POST",
        params: {token: userService.getToken()},
        data: universidadeService.getCurso().inscritos
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response.data.lenght > 0);
        $scope.inscritos = response.data;
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    $scope.curso = universidadeService.getCurso();
    var dados = [];

    $scope.curso.inscritos.forEach(function (inscrito) {
        if (inscrito.presente) dados.push(inscrito);
    });

    $scope.title = "Gerenciar curso | " + $scope.curso.nome;
    var data_criacao = new Date($scope.curso.data_criacao);
    var data_inicio = new Date($scope.curso.data_inicio);
    var data_limite_inscricao = new Date($scope.curso.data_limite_inscricao);
    $scope.dataCriacao = data_criacao.getDate() + '/' + (data_criacao.getMonth()+1) + '/' + data_criacao.getFullYear();
    $scope.dataInicio = data_inicio.getDate() + '/' + (data_inicio.getMonth()+1) + '/' + data_inicio.getFullYear();
    $scope.dataLimite = data_limite_inscricao.getDate() + '/' + (data_limite_inscricao.getMonth()+1) + '/' + data_limite_inscricao.getFullYear() + ' - ' + data_limite_inscricao.getHours() + ':' + data_limite_inscricao.getMinutes() + '0';
    // upload de arquivos
    $scope.presentes = 0;
    $scope.curso.inscritos.forEach(function(inscrito){
        if(inscrito.presente) $scope.presentes++;
    });

    $scope.uploadFile = function () {
        var file = $scope.myFile;

        // console.log('file is ');
        // console.dir(file);

        // var uploadUrl = "/cursos/uploadfile";
        // fileUpload.uploadFileToUrl(file, uploadUrl);
    };

    //download de arquivos
    $scope.downloadFile = function (filename, cursoId) {
        $http.post('/cursos/download', {filename: filename, cursoId: cursoId})
            .then(function (response) {

            }).catch(function (err) {
            // console.log(err)
        })
    };

// 	$scope.uploadFile = function(){
//  	$scope.fileSelected = function(files) {
//      if (files && files.length) {
//         $scope.file = files[0];
//      }
//      $upload.upload({
//        url: '/cursos/uploadfile', //node.js route
//        file: $scope.file
//      })
//      .success(function(data) {
//        console.log(data, 'uploaded');
//       });
//     };
// };
//     console.log($scope.curso);
    $scope.apertei = false;

    $scope.pressionado = function () {
        $scope.apertei = true;

    };

    $scope.getDataInscricao = function (curso, inscrito){
        for(var i = 0; i < curso.inscritos.length; i++){
            if(curso.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                return curso.inscritos[i].data_inscricao;
            }
        }
    };

    $scope.conferirPresenca = function (curso, inscrito) {
        for(var i = 0; i < curso.inscritos.length; i++){
            if(curso.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                return curso.inscritos[i].presente;
            }
        }
    };

    $scope.marcarPresenca = function (curso, inscrito) {
        for(var i = 0; i < curso.inscritos.length; i++){
            if(curso.inscritos[i].sAMAccountName === inscrito.mail.substring(0, inscrito.mail.indexOf('@'))){
                curso.inscritos[i].presente = !curso.inscritos[i].presente;
                if (curso.inscritos[i].presente) {
                    $scope.participantes.push(inscrito);
                    $scope.presentes++;
                }
                else {
                    $scope.participantes.splice(searchParticipanteIndex(inscrito), 1);
                    $scope.presentes--;
                }

                $http({
                    method: 'PUT'
                    , url: '/cursos/mudaPresenca/' + curso._id
                    , data: curso.inscritos[i]
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
        var exactTime = $scope.curso.carga_horaria;
        var hours = Math.floor(exactTime);
        var minutes = exactTime % 1;
        minutes = parseInt(minutes*60);
        var hourMinutes = hours + " hora(s) e " + minutes + " minuto(s)";
        return hourMinutes;
    }

    $scope.todosClick = function (){
        // if (!$scope.isInscritosDisabled) {
        //     $scope.isInscritosDisabled = true;
        //     $scope.isSurveyShown = false;
        // } else {
        //     $scope.isInscritosDisabled = false;
        // }
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

        // $scope.isSurveyShown = true;
        $scope.isSurveyShown = false;
        var inscritos = $scope.inscritos;
        var inscritosEmail = "";
        for (var i = 0 ; i <inscritos.length ; i++) {
            inscritosEmail+= ";" + inscritos[i].mail;
        }
        $scope.contatosMail = inscritosEmail;
        console.log(inscritosEmail)

    }

    $scope.includeSurveyClick = function() {
        if ($scope.isSuveryInputDisabled) {
            $scope.isSuveryInputDisabled = false;
        } else {
            //$scope.isSuveryInputDisabled = true;
            $scope.isSuveryInputDisabled = false;
        }
    }
}

function fileModel($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function () {
                scope.$apply(function () {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}

function fileUpload ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })

        .success(function(){
        })
        .error(function(){
        });
    }
}

angular
    .module('inspinia')
    .directive('fileModel', fileModel )
    .service('fileUpload', fileUpload)
    .controller('gerenciar_curso', gerenciar_curso);



