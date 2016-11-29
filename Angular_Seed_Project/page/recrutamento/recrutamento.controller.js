/**
 * Created by Hosoya on 23/11/16.
 */
function recrutamentoCtrl($scope, $http, userService, $state, universidadeService, $modal) {
    $http({
        url: '/vagas',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        $scope.vagas = response.data;
    }).catch(function (err) {
        $state.go('login');
    });

    const INSCRICOES_ABERTAS = "Inscrições Abertas";
    const INSCRICOES_ENCERRADAS = "Inscrições Encerradas";
    const ENCERRADO = "Encerrado";

    $scope.createJob = function () {

        var modalInstance = $modal.open({
            templateUrl: 'page/modais/modalRecrutamento.html',
            controller: modalRecrutamentoCtrl,
            resolve: {
                getCurso: function () {
                    return undefined;
                },
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
    };

    $scope.edit = function (curso) {

        var modalInstance = $modal.open({
            templateUrl: 'page/modais/modalUniversidade.html',
            controller: ModalInstanceCtrl,
            resolve: {
                getCurso: function () {
                    return curso;
                },
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
    };

    $scope.title = "Recrutamento Certsys";

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

    $scope.vagaDeletedFilter= function (vaga) {
        if (vaga.isDeleted) {
            return false; // curso is deleted, so does NOT show on table
        } else {
            return true;  // curso is NOT deleted, so it is showed on table
        }
    };

    $scope.isChecked = function (status) {
        for (var i = 0; i < $scope.selectedStatus.length; i++ ) {
            if ($scope.selectedStatus[i] == status ) {
                console.log('myicon')
                return 'fa fa-check pull-right-universidadeFilter';
            }
        }
        return false;
    };


    $scope.buttonDisabled = false;

    $scope.subscribed = function (vaga) {
        var retorno = false;
        vaga.inscritos.forEach(function (inscrito) {
            if (inscrito.sAMAccountName === userService.getUser().sAMAccountName) retorno = true;

        });
        return retorno;
    };

    $scope.addSubscription = function (vaga) {
        $scope.buttonDisabled = true;
        var index = vaga.inscritos.map(function (inscrito) {
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
                vaga.inscritos.push(dados);
                $http({
                    method: 'PUT'
                    , url: '/vagas/addSubscription/' + vaga._id
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

    $scope.removeSubscription = function (vaga) {
        $scope.buttonDisabled = true;
        var index = vaga.inscritos.map(function (inscrito) {
            return inscrito.sAMAccountName;
        }).indexOf(userService.getUser().sAMAccountName);
        if (index > -1) vaga.inscritos.splice(index, 1);
        var data = {sAMAccountName: userService.getUser().sAMAccountName};
        $http({
            method: 'PUT'
            , url: '/vagas/removeSubscription/' + vaga._id
            , data: data
            , params: {token: userService.getToken()}
        }).then(function (response) {
            $scope.buttonDisabled = false;
            //your code in case the post succeeds
        }).catch(function (err) {
            // console.log(err);
        });
    };

    $scope.status = function (vaga) {
        var data_atual = new Date();
        var data_limite_inscricao = new Date(vaga.data_limite_inscricao);
        var data_inicio = new Date(vaga.data_inicio);
        if (data_atual < data_limite_inscricao) {
            $scope.backgroundColor = '#3dadd0';
            $scope.color = '#ffffff';
            vaga.status = INSCRICOES_ABERTAS; //---added here
            return INSCRICOES_ABERTAS;
        } else if (data_atual > data_inicio) {
            $scope.backgroundColor = 'red';
            $scope.color = '#ffffff';
            vaga.status= ENCERRADO; //---added here
            return ENCERRADO;
        }
        else {
            $scope.backgroundColor = '#d1dade';
            $scope.color = '#676a6c';
            vaga.status = INSCRICOES_ENCERRADAS; //---added here
            return INSCRICOES_ENCERRADAS;
        }
    };

    $scope.allowSubscription = function (vaga) {
        if (vaga.inscritos.length >= vaga.max_inscritos) return false;
        else if ($scope.status(vaga) !== INSCRICOES_ABERTAS) return false;
        return true;
    };

    $scope.permissions = {
        debug: userService.Authenticate().debug,
        admin: userService.Authenticate().admin,
        comercial: userService.Authenticate().comercial,
        diretores: userService.Authenticate().diretores,
        prevendas: userService.Authenticate().prevendas,
        tecnico: userService.Authenticate().tecnico,
        instructors: userService.Authenticate().instructors
    };

}

function vagaStatusFilter () {
    return function (vagas, selectedStatus) {
        if (!vagas || !selectedStatus) return;

        if (!angular.isUndefined(vagas) && !angular.isUndefined(selectedStatus) && selectedStatus.length > 0) {
            var filteredVagas = [];
            angular.forEach(selectedStatus, function (status) {
                angular.forEach(vagas, function (vaga) {
                    if (angular.equals(vaga.status, status)) {
                        filteredVagas.push(vaga);
                    }
                });
            });

            return filteredVagas;

        } else {
            return vagas;
        }
    }
}

angular
    .module('inspinia')
    .controller('recrutamentoCtrl', recrutamentoCtrl)
    .filter('vagaStatusFilter', vagaStatusFilter);






