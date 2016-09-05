function universidade($scope, $http, userService, $state, universidadeService) {
    $http({
        url: '/cursos',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response);
        $scope.cursos = response.data;
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    var INSCRICOES_ABERTAS = "Inscrições Abertas";
    var INSCRICOES_ENCERRADAS = "Inscrições Encerradas";
    var ENCERRADO = "Encerrado";


    $scope.title = "Universidade Certsys";

    $scope.tiposStatus = ["Inscrições Abertas","Inscrições Encerradas","Encerrado"];

    $scope.selectedStatus =[];
    $scope.searchByStatus = function (){
        var status = this.status;
        for (var i=0; i < $scope.selectedStatus.length; i++ ){
            if ($scope.selectedStatus[i] == status) {
                $scope.selectedStatus.splice(i,1);
                return;
            }
        }
        $scope.selectedStatus.push(status);

    }

    $scope.isChecked = function (status) {
        for (var i = 0; i < $scope.selectedStatus.length; i++ ) {
            if ($scope.selectedStatus[i] == status ) {
                console.log('myicon')
                return 'fa fa-check pull-right-universidadeFilter';
            }
        }
        console.log('false')
        return false;
    };


    $scope.buttonDisabled = false;

    $scope.subscribed = function (curso) {
        var retorno = false;
        curso.inscritos.forEach(function (inscrito) {
            if (inscrito.sAMAccountName === userService.getUser().sAMAccountName) retorno = true;

        });
        return retorno;
    };

    $scope.addSubscription = function (curso) {
        $scope.buttonDisabled = true;
        var index = curso.inscritos.map(function (inscrito) {
            return inscrito.sAMAccountName;
        }).indexOf(userService.getUser().sAMAccountName);

        if (index === -1) {
            $http({
                url: '/contacts/perfil',
                method: "GET",
                params: {token: userService.getToken(), mail: userService.getUser().sAMAccountName}
            }).then(function (response) {
                //your code in case the post succeeds
                // console.log(response.data.lenght > 0);
                var contato = response.data[0];
                var dados = {
                    _id: contato._id,
                    sAMAccountName: userService.getUser().sAMAccountName,
                    data_inscricao: new Date().toISOString(),
                    presente: false
                };
                curso.inscritos.push(dados);
                $http({
                    method: 'PUT'
                    , url: '/cursos/addSubscription/' + curso._id
                    , data: dados
                    , params: {token: userService.getToken()}
                }).then(function (response) {
                    $scope.buttonDisabled = false;
                    //your code in case the post succeeds
                }).catch(function (err) {
                    // console.log(err);
                });
            }).catch(function (err) {
                $state.go('login');
                // console.log(err);
            });

        }
    };

    $scope.removeSubscription = function (curso) {
        $scope.buttonDisabled = true;
        var index = curso.inscritos.map(function (inscrito) {
            return inscrito.sAMAccountName;
        }).indexOf(userService.getUser().sAMAccountName);
        if (index > -1) curso.inscritos.splice(index, 1);
        var data = {sAMAccountName: userService.getUser().sAMAccountName};
        $http({
            method: 'PUT'
            , url: '/cursos/removeSubscription/' + curso._id
            , data: data
            , params: {token: userService.getToken()}
        }).then(function (response) {
            $scope.buttonDisabled = false;
            //your code in case the post succeeds
        }).catch(function (err) {
            // console.log(err);
        });
    };

    $scope.status = function (curso) {
        var data_atual = new Date();
        var data_limite_inscricao = new Date(curso.data_limite_inscricao);
        var data_inicio = new Date(curso.data_inicio);
        if (data_atual < data_limite_inscricao) {
            $scope.backgroundColor = '#3dadd0';
            $scope.color = '#ffffff';
            curso.status = INSCRICOES_ABERTAS; //---added here
            return INSCRICOES_ABERTAS;
        }else if (data_atual > data_inicio){
            $scope.backgroundColor = 'red';
            $scope.color = '#ffffff';
            curso.status= ENCERRADO; //---added here
            return ENCERRADO;
        }
        else{
            $scope.backgroundColor = '#d1dade';
            $scope.color = '#676a6c';
            curso.status = INSCRICOES_ENCERRADAS; //---added here
            return INSCRICOES_ENCERRADAS;
        }
    };

    $scope.allowSubscription = function (curso){
        if(curso.inscritos.length >= curso.max_inscritos) return false;
        else if ($scope.status(curso) !== INSCRICOES_ABERTAS) return false;
        return true;
    };

    $scope.permissions = {
        debug: false,
        admin: false,
        comercial: false,
        diretores: false,
        prevendas: false,
        tecnico: false,
        instructors: false
    };

    // $scope.myFilter = function (selectedStatus, cursos) {
    //     if (!cursos) return;
    //     console.log(selectedStatus);
    //     console.log(cursos);
    //     return cursos
    // }

    if (userService.instructorGroup()) $scope.permissions.instructors = true;
}

function cursoStatusFilter () {
    return function (cursos, selectedStatus) {
        if (!cursos || !selectedStatus) return;

        if (!angular.isUndefined(cursos) && !angular.isUndefined(selectedStatus) && selectedStatus.length > 0) {
            var filtredCursos = [];
            angular.forEach(selectedStatus, function (status) {
                angular.forEach(cursos, function (curso) {
                    if (angular.equals(curso.status, status)) {
                        filtredCursos.push(curso);
                    }
                });
            });
            //console.log(tempClients)
            return filtredCursos;

        } else {
            return cursos;
        }
    }
}

angular
    .module('inspinia')
    .controller('universidade', universidade)
    .filter('cursoStatusFilter', cursoStatusFilter);






