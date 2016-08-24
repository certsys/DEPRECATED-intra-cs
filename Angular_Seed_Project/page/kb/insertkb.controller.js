function kb_insert($scope, $http, $state, userService, peopleGroups) {
	$http({
        url: '/kb',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    $scope.permissions = {
        debug: false,
        admin: false,
        comercial: false,
        diretores: false,
        prevendas: false,
        tecnico: false
    };

    if (userService.devGroup()) $scope.permissions.debug = true;

    peopleGroups.GROUPS()
        .then(function (data) {
            if (angular.isDefined(data)) {
                if (userService.insideGroup(data[0].users)) $scope.permissions.admin = true;
                if (userService.insideGroup(data[4].users)) $scope.permissions.comercial = true;
                if (userService.insideGroup(data[2].users)) $scope.permissions.diretores = true;
                if (userService.insideGroup(data[3].users)) $scope.permissions.prevendas = true;
                if (userService.insideGroup(data[1].users)) $scope.permissions.tecnico = true;
            }
        }, function (error) {
            console.log('error', error);
        });

    if (!($scope.permissions.debug || $scope.permissions.admin || $scope.permissions.diretores))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if(!userService.isAdmin())
    //     $state.go('feed')

    $scope.today = new Date();
    $scope.title = "Base de Conhecimento CS - Novo elemento";
    $scope.products = [];// preencher com os pais e filhos.
    $scope.thumbnail = [];
    $scope.fileReaderSupported = window.FileReader != null
    $scope.dateHolder = new Date();
    //$scope.selectedDate;

    var getFolders = function(){
    	$http.get('/kb/get_folders')
    	.then(function(response){
    		//montar o array identado
    		console.log(response.data)
    		$scope.products=response.data
    	})
    	.catch(function(err){console.log('Something went wrong...', err)})
    }();

    $scope.submitFolder=function(){
    	var output={
    		parent: angular.element('#parent').val(),
    		text: angular.element('#newFolder').val(),
    		type: 'folder',
    		children: []
    	}
    	console.log(output);
    	$http({method: 'POST', url:'/kb/ins_folder', data: output, params: {token: userService.getToken()}})
        	.then(function(response){
                alert('Produto inserido com sucesso.');
                getFolders(); //pega as paginas novamente
        	})
        	.catch(function(err){
        		//your code in case your post fails
        		//console.log(err);
                alert('Ocorreu um erro. Produto não adicionado. \nErro: '+JSON.stringify(err));
        	});
    }

    $scope.submitPage=function(){
    	var output={
    		parent: angular.element('#page_parent').val(),
    		title: angular.element('#page_title').val(),
    		text: angular.element('#page_text').val(),
    		type: 'page',
    		children: []
    	}
    	console.log(output);
    	$http({method: 'POST', url:'/kb/ins_page', data: output, params: {token: userService.getToken()}})
        	.then(function(response){
        		//your code in case the post succeeds
        		//console.log(response);
                alert('Produto inserido com sucesso.');
                // $state.go('contatos');
        	})
        	.catch(function(err){
        		//your code in case your post fails
        		//console.log(err);
                alert('Ocorreu um erro. Produto não adicionado. \nErro: '+JSON.stringify(err));
        	});
    }

    $scope.submitFile=function(){
    	var output={
    		parent: angular.element('#file').val(),
    		// title: angular.element('#page_title').val(),
    		// text: angular.element('#page_text').val(),
    		type: 'file',
    	}
    	console.log(output);
    	$http({method: 'POST', url:'/kb/ins_file', data: output, params: {token: userService.getToken()}})
        	.then(function(response){
        		//your code in case the post succeeds
        		//console.log(response);
                alert('Produto inserido com sucesso.');
                // $state.go('contatos');
        	})
        	.catch(function(err){
        		//your code in case your post fails
        		//console.log(err);
                alert('Ocorreu um erro. Produto não adicionado. \nErro: '+JSON.stringify(err));
        	});
    }
}

angular.module('inspinia').controller('kb_insert', kb_insert);