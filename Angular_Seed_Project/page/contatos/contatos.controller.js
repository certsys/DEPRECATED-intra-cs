function contacts($scope, $http) {
    // $scope.contatos = [
    // {id: "98273yguhrewnfds", name: "John Smith", maintool:"Websphere", mail:"john.smith@certsys.com.br", phone: "(11)99999-9999", skype:"john_smith", img: "img/a2.jpg"},
    // 	{id: "98273yguhrewnfds", name: "Contato Teste", maintool:"SCCD", mail:"john.smith@certsys.com.br", phone: "(11)99999-9999", skype:"john_smith", img: "img/a2.jpg"},
    // 	{id: "98273yguhrewnfds", name: "Debug Contato", maintool:"NetBackup", mail:"john.smith@certsys.com.br", phone: "(11)99999-9999", skype:"john_smith", img: "img/a2.jpg"}
    // ];


    $http.get('/contacts').then(function (response) {
        $scope.contatos = response.data;
    }, console.log("Erro ao pegar os dados"));

    $scope.title = "Contatos";
};


angular
    .module('inspinia')
    .controller('contacts', contacts);

