function kb_insert($scope, $http, $state, userService, peopleGroups) {
	// $http({
 //        url: '/kb',
 //        method: "GET",
 //        params: {token: userService.getToken()}
 //    }).then(function (response) {
 //        //your code in case the post succeeds
 //    }).catch(function (err) {
 //        $state.go('login');
 //        console.log(err);
 //    });


    if (!(userService.Authenticate().debug || userService.Authenticate().admin || userService.Authenticate().diretores))
        $state.go('feed');

    // Só administradores do sistema podem entrar nessa view
    // if(!userService.isAdmin())
    //     $state.go('feed')

    var rootNode;

    $scope.today = new Date();
    $scope.title = "Base de Conhecimento CS - Novo elemento";
    $scope.products = [];// preencher com os pais e filhos.
    $scope.thumbnail = [];
    $scope.fileReaderSupported = window.FileReader != null
    $scope.dateHolder = new Date();
    $scope.page = {};
    $scope.folder = {};
    //$scope.selectedDate;

    var getFolders = function(){
    	$http.get('/kb/get_folders')
    	.then(function(response){
    		//montar o array identado
            console.log(response.data)
            data= response.data;
            for(i=0; i<data.length; i++){
                if (data[i].text=="Produtos")  {
                    rootNode = data[i]._id;
                    break;
                }
            // $scope.tree=[];
            // for(i=0; i<data.length; i++){
            //     if(data[i].text=="Produtos"){}
            //     else{
            //         tree.push
                }
    		$scope.products=response.data
    	})
        $http.get('/kb/get_pages').then(function(response){
            console.log(response.data)
            $scope.pages=response.data
        }).catch(function(err){})
    };

    getFolders();


    $scope.submitFolder=function(){
        //console.log(angular.element('#folder_parent').val())
    	var output={
    		parent: $scope.folder.parent,
    		text: $scope.folder.newFolder,
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
    		parent: $scope.page.parent,
    		title: $scope.page.titulo,
    		text: $scope.page.text,
            assinatura: userService.getUser().sAMAccountName,
            data: Date(),
            tags: $scope.page.tags
    	}
    	console.log(output);
    	$http({method: 'POST', url:'/kb/ins_page', data: output, params: {token: userService.getToken()}})
        	.then(function(response){
        		//console.log(response);
                alert('Página inserida com sucesso.');
                getFolders()
        	})
        	.catch(function(err){
        		//your code in case your post fails
        		//console.log(err);
                alert('Ocorreu um erro. Produto não adicionado. \nErro: '+JSON.stringify(err));
        	});
    }

    $scope.uploadFile = function(){
    var file = $scope.myFile;

    console.log('file is ' );
    console.dir(file);

    var uploadUrl = "/kb/uploadfile";
    fileUpload.uploadFileToUrl(file, uploadUrl);
    };


    //download de arquivos
    $scope.downloadFile=function(filename, cursoId){
        $http.post('/kb/download',{filename: filename, cursoId: cursoId})
        .then(function(response){

        }).catch(function(err){console.log(err)})
    }

    // $scope.submitFile=function(){
    // 	var output={
    // 		parent: angular.element('#file').val(),
    // 		// title: angular.element('#page_title').val(),
    // 		// text: angular.element('#page_text').val(),
    // 		type: 'file',
    // 	}
    // 	console.log(output);
    // 	$http({method: 'POST', url:'/kb/ins_file', data: output, params: {token: userService.getToken()}})
    //     	.then(function(response){
    //     		//your code in case the post succeeds
    //     		//console.log(response);
    //             alert('Produto inserido com sucesso.');
    //             // $state.go('contatos');
    //     	})
    //     	.catch(function(err){
    //     		//your code in case your post fails
    //     		//console.log(err);
    //             alert('Ocorreu um erro. Produto não adicionado. \nErro: '+JSON.stringify(err));
    //     	});
    // }
}

angular.module('inspinia').controller('kb_insert', kb_insert);