function contacts($scope, $http, contactService) {
   
    
    
    $http.get('/contacts').then(function (response) {
        $scope.contatos = response.data;
    }).catch(function(response){console.log("Erro ao pegar os dados")});


    $scope.sendContact = function(currObj){
            contactService.sendContact(currObj);
        };


    $scope.title = "Contatos"; 
};

    

angular
    .module('inspinia')
    .controller('contacts', contacts);

