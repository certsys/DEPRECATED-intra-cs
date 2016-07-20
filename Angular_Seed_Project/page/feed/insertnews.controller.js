function insertnews($scope, $http) {
    $scope.submit = function () {
        var data = {
            titulo: $scope.titulo,
            imagem: $scope.imagem,
            texto: $scope.texto,
            assinatura: $scope.assinatura
        };

        var output = angular.toJson(data);
        $http({method: 'POST', url:'/posts', data: output})
        	.then(function(response){
                //your code in case the post succeeds
                console.log(response);
                alert('Post inserido com sucesso.');
            })
            .catch(function(err){
                //your code in case your post fails
                console.log(err);
                alert('Ocorreu um erro. Post não adicionado. \nErro: '+err);
            });
    }
};

angular
    .module('inspinia')
    .controller('insertnews', insertnews);

