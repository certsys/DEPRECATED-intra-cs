function insertcontacts($scope, $http, $timeout, $state, userService) {
    $http({
        url: '/contacts',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });
    
    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores))
        $state.go('feed');
    
    $scope.title='Novo Contato';

    // Só administradores do sistema podem entrar nessa view
    // if(!userService.isAdmin())
    //     $state.go('feed');
    // $scope.title='Novo Contato';

    $scope.maintools = [];
    $scope.tools_basic = [];
    $scope.tools_intermediate = [];
    $scope.tools_advanced = [];

    $scope.loadTools = function($query) {
        return $http.get('tools.json', { cache: true}).then(function(response) {
            var tools = response.data;
            return tools.filter(function(tool) {
                return tool.worktool.toLowerCase().indexOf($query.toLowerCase()) != -1;
            });
        });
    };

    // $scope.addFormFieldMain = function() {
    //     $scope.tooltable.maintools.push('');
    // }
    // $scope.addFormFieldBasic = function() {
    //     // if (angular.element('#advanced').val() !== "")
    //         $scope.tooltable.tools_basic.push('');
    // }
    // $scope.addFormFieldInterm = function() {
    //     // if (angular.element('#inter').val() !== "")
    //         $scope.tooltable.tools_intermediate.push('');
    // }
    // $scope.addFormFieldAdvanc = function() {
    //     // if (angular.element('#basic').val() !== "")
    //         $scope.tooltable.tools_advanced.push('');
    // }

    $scope.thumbnail = [];
    $scope.fileReaderSupported = window.FileReader != null;
    $scope.photoChanged = function (files) {
        if (files != null) {
            var file = files[0];
            if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
                $timeout(function () {
                    var fileReader = new FileReader();
                    fileReader.readAsDataURL(file); // convert the image to data url. 
                    fileReader.onload = function (e) {
                        $timeout(function () {
                            $scope.thumbnail.dataUrl = e.target.result; // Retrieve the im  age. 
                        });
                    }
                });
            }
        }
    };


    $scope.submit = function () {
        var basic_array = [];
        var inter_array = [];
        var advanced_array = [];
        var log = [];
        for(var i = 0; i < $scope.tools_basic.length; i++) {
            angular.forEach($scope.tools_basic[i], function(value, key) {
                if (key != "$$hashKey" && key != "worktool") basic_array.push(value);
            }, log);
        }
        for(var i = 0; i < $scope.tools_intermediate.length; i++) {
            angular.forEach($scope.tools_intermediate[i], function(value, key) {
                if (key != "$$hashKey" && key != "worktool") inter_array.push(value);
            }, log);
        }

        for(var i = 0; i < $scope.tools_advanced.length; i++) {
            angular.forEach($scope.tools_advanced[i], function(value, key) {
                if (key != "$$hashKey" && key != "worktool") advanced_array.push(value);
            }, log);
        }

        var tooltable = {
            maintools : $scope.maintools,
            tools_basic : basic_array,
            tools_intermediate : inter_array,
            tools_advanced : advanced_array
        };

        var data = {
            nome: $scope.name,
            sobre: $scope.sobre,
            grupo: $scope.grupo,
            tooltable: tooltable,
            mail: $scope.mail,
            phone: $scope.phone,
            skype: $scope.skype,
            imagem: $scope.thumbnail.dataUrl,
            datanasc: $scope.datanasc
        };

        var output = JSON.stringify(data);
        // console.log(output);
        $http({method: 'POST', url:'/contacts', data: output, params: {token: userService.getToken()}})
        	.then(function(response){
        		//your code in case the post succeeds
        		//console.log(response);
                alert('Contato inserido com sucesso.');
                $state.go('contatos');
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
