function contacts($scope, $http, contactService, userService, $state) {

    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        $scope.contatos = response.data;
        console.log(response);
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });


    $scope.restrict = function() {
        var inputed = angular.element('#top-search').val().toLowerCase();
        // $http.get('/contacts').then(function (response) {
        //     $scope.contatos = response.data;
        // }).catch(function(response){console.log("Erro ao pegar os dados")});
    };

    $scope.sendContact = function(currObj){
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
};

    

angular
    .module('inspinia')
    .controller('contacts', contacts);

