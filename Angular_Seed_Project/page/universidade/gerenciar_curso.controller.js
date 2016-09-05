function gerenciar_curso($scope, $http, userService, fileUpload, $state, universidadeService) {
    $scope.participantes = [];
    $scope.loading = 0;

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
        // console.log($scope.inscritos);
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    $scope.curso = universidadeService.getCurso();
    var dados = [];

    $scope.curso.inscritos.forEach(function (inscrito) {
        if (inscrito.presente) dados.push(inscrito);
    });

    $http({
        url: '/contacts/inscritos',
        method: "POST",
        params: {token: userService.getToken()},
        data: dados
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response.data.lenght > 0);
        $scope.participantes = response.data;
        // console.log($scope.inscritos);
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
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

        console.log('file is ');
        console.dir(file);

        var uploadUrl = "/cursos/uploadfile";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };


    //download de arquivos
    $scope.downloadFile = function (filename, cursoId) {
        $http.post('/cursos/download', {filename: filename, cursoId: cursoId})
            .then(function (response) {

            }).catch(function (err) {
            console.log(err)
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

}


angular
    .module('inspinia')
    .controller('gerenciar_curso', gerenciar_curso);
