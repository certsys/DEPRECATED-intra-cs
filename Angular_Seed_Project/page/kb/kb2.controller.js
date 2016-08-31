function kbCtrl($scope, $http, $state, userService, fileUpload) {
    
    var rootNode;

    $http({
        url: '/kb',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        var data= response.data
        //console.log(data);
        for(i=0; i<data.length; i++){
            if (data[i].text=="Produtos")  {
                rootNode = data[i]._id;
                break;
            }
        }
        $scope.folders=data;
        // $scope.folders=data;
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    $scope.getPages = function(id){
        $http.get('/kb/pages'+id)
        .then(function(response){
            $scope.pages=response.data;
        }).catch(function(err){console.log(err)})
    }

    $scope.sendPage=function(Obj){
        $scope.page=Obj;
    }
    
    $scope.getSelectedNode = function() {
        var selectedNode = $scope.treeInstance.jstree(true).get_node($scope.treeInstance.jstree(true).get_selected());
        // $http.get('/kb').then(function (response) {
        //     // console.log(response.data);
        //     var binaryData = [];
        //     binaryData.push(response.data);
        //     var url = URL.createObjectURL(new Blob(binaryData, {type: "octet/stream"}));
        //     var a = document.createElement('a');
        //     a.href = url;
        //     a.download = 'fotos.csv';
        //     a.target = '_blank';
        //     a.click();
        // }, console.log("Erro ao pegar os dados"));

        $http({
            method: 'POST'
            , url: '/kb'
            , data: selectedNode
            , params: {token: userService.getToken()}
            , responseType: 'arraybuffer'
        }).then(function (response) {
            //your code in case the post succeeds
            var binaryData = [];
            var archiveName = selectedNode.text;
            binaryData.push(response.data);
            var url = URL.createObjectURL(new Blob(binaryData, {type: "application/pdf"}));
            var a = document.createElement('a');
            a.href = url;
            a.download = archiveName + ".pdf";
            a.target = '_blank';
            a.click();
            console.log();
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });
    };

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
}

angular.module('inspinia').controller('kbCtrl', kbCtrl);