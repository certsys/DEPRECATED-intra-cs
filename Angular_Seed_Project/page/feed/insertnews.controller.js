function insertnews($scope, $http) {
    $scope.submit = function () {
            var data = {
                titulo: $scope.titulo
                , imagem: $scope.imagem
                , texto: $scope.texto
                , assinatura: $scope.assinatura
            };
            var output = angular.toJson(data);
            $http({
                method: 'POST'
                , url: '/posts'
                , data: output
            }).then(function (response) {
                //your code in case the post succeeds
                console.log(response);
            }).catch(function (err) {
                //your code in case your post fails
                console.log(err);
            });
        }
        // Opções da Caixa de Texto do Corpo do Arquivo
    $scope.options = {
        placeholder: 'Digite aqui o texto principal do post...'
        , height: 300
        , toolbar: [
              ['style', ['style', 'bold', 'italic', 'underline']]
              , ['color', ['color']]
              , ['font', ['superscript', 'subscript']]
              , ['fontsize', ['fontsize']]
              , ['table', ['table']]
              , ['para', ['ul', 'ol', 'paragraph']]
            ]
    };
};
angular.module('inspinia').controller('insertnews', insertnews);