function navigationCrtl($scope, $state, userService, contactService, peopleGroups, $http) {


    $scope.logout = function () {
        console.log("Entrei na função logout!!!")
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
    
    peopleGroups.ADMINS()
        .then(function(data) {
            if(angular.isDefined(data) && userService.insideGroup(data)) $scope.permissions.admin = true;
        }, function(error){
            console.log('error', error);
        });

    peopleGroups.DIRETORES()
        .then(function(data) {
            if(angular.isDefined(data) && userService.insideGroup(data)) $scope.permissions.diretores = true;
        }, function(error){
            console.log('error', error);
        });

    $scope.perfil = function () {
        $http({
            url: '/contacts/perfil',
            method: "GET",
            params: {token: userService.getToken(), mail: userService.getUser().mail}
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