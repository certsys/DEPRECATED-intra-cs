function navigationCrtl($scope, $state, userService, contactService, peopleGroups, $http) {

    $scope.logout = function () {
        console.log("Entrei na função logout!!!");
        userService.sendToken('Logout');
        $state.go('login');
    };

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

    $scope.perfil = function () {
        $http({
            url: '/contacts/perfil',
            method: "GET",
            params: {token: userService.getToken(), mail: userService.getUser().sAMAccountName}
        }).then(function (response) {
            //your code in case the post succeeds
            if(response.data.length > 0) {
                contactService.sendContact(response.data[0]);
                if($state.current.name === 'perfil') {
                    $state.go($state.$current, null, { reload: true });
                }
                $state.go('perfil');
            }else{
                alert("Infelizmente o seu usuário ainda não tem dados no sistema :(")
            }
        }).catch(function (err) {
            $state.go('login');
            console.log(err);
        });
    };

    $scope.nome = userService.getUser().givenName;

}
angular.module('inspinia').controller('navigationCrtl', navigationCrtl);