function insertcontacts($scope, $http) {
    $scope.title='Novo Contato';

    $scope.submit = function () {
        var data = {
            name: $scope.name,
            maintool: $scope.maintool,
            tools: $scope.tools, //ARRAY
            mail: $scope.mail,
            phone: $scope.phone,
            skype: $scope.skype,
            img: $scope.img
        };

        var output = JSON.stringify(data);
        console.log(output);
        $http({method: 'POST', url:'/contacts', data: output})
        	.then(function(response){
        		//your code in case the post succeeds
        		//console.log(response);
                alert('Contato inserido com sucesso.');
        	})
        	.catch(function(err){
        		//your code in case your post fails
        		//console.log(err);
                alert('Ocorreu um erro. Contato não adicionado. \nErro: '+JSON.stringify(err));
        	});
    }
    
};

angular
    .module('inspinia')
    .controller('insertcontacts', insertcontacts);
