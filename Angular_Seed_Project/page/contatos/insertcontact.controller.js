function insertcontacts($scope, $http) {
    $scope.title='Novo Contato';

    $scope.tooltable = { 
            maintools : ['',],
            tools_basic : ['',],
            tools_intermediate : ['',],
            tools_advanced : ['',] 
        };

    $scope.addFormFieldMain = function() {
        $scope.tooltable.maintools.push('');
    }
    $scope.addFormFieldBasic = function() {
        $scope.tooltable.tools_basic.push('');
    }
    $scope.addFormFieldInterm = function() {
        $scope.tooltable.tools_intermediate.push('');
    }
    $scope.addFormFieldAdvanc = function() {
        $scope.tooltable.tools_advanced.push('');
    }

    $scope.submit = function () {
        

        var data = {
            name: $scope.name,
            tooltable: $scope.tooltable,
            mail: $scope.mail,
            phone: $scope.phone,
            skype: $scope.skype,
            imagem: $scope.imagem
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
