function contacts($scope, $http, contactService, userService, $state) {

    var log = [];
    $scope.tools = [];

    $scope.ferramenta = "";

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        $scope.contatos = response.data;
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });


    $http.get('tools.json', {cache: true}).then(function (response) {
        var toolsJson = response.data;
        angular.forEach(toolsJson, function (value, key) {
            if (key != "$$hashKey" && key != "worktool") $scope.tools.push(value);
        }, log);
    });

    $scope.$watch('ferramenta', function (newValue, oldValue) {
        // Evita carregar se vierem os mesmos dados
        if (newValue !== oldValue) {
            $http({
                url: '/contacts',
                method: "GET",
                params: {token: userService.getToken(), inputed: newValue}
            }).then(function (response) {
                //your code in case the post succeeds
                $scope.contatos = response.data;
                console.log(response);
            }).catch(function (err) {
                $state.go('login');
                console.log(err);
            });
        }
    });

    // $scope.restrict = function(contato) {
    //     console.log(contato);
    //     if(angular.isUndefined(contato)) return false;
    //     else if (contato.tooltable.tools_basic.indexOf($scope.ferramenta) === -1 &&
    //         contato.tooltable.tools_intermediate.indexOf($scope.ferramenta) === -1 &&
    //         contato.tooltable.tools_advanced.indexOf($scope.ferramenta) === -1) return false;
    //     else return true;
    // };

    $scope.sendContact = function (currObj) {
        contactService.sendContact(currObj);
    };

    // $scope.haveTool = function(person){
    //     console.log(person.nome);
    //     if (angular.isDefined(person.tooltable)) {
    //         var adv = person.tooltable.tools_advanced;
    //         var int = person.tooltable.tools_intermediate;
    //         var bas = person.tooltable.tools_basic;
    //         var inputed = angular.element('#top-search').val().toLowerCase();
    //         if (adv.length > 0)
    //             for (var index = 0; index < adv.length; index++) {
    //                 console.log(adv[index].toLowerCase());
    //                 if (adv[index].toLowerCase().indexOf(inputed) !== -1) return true;
    //             }
    //         if (int.length > 0)
    //             for (var index = 0; index < int.length; index++) {
    //                 console.log(int[index].toLowerCase());
    //                 if (int[index].toLowerCase().indexOf(inputed) !== -1) return true;
    //             }
    //         if (bas.length > 0)
    //             for (var index = 0; index < bas.length; index++) {
    //                 console.log(bas[index].toLowerCase());
    //                 if (bas[index].toLowerCase().indexOf(inputed) !== -1) return true;
    //             }
    //         return false;
    //     }
    //     else if (angular.isUndefined(inputed)) return true;
    //     else return false;
    // }


    $scope.title = "Contatos";
}


angular
    .module('inspinia')
    .controller('contacts', contacts);

