function kbCtrl($scope, $http, $state, userService) {

    $http({
        url: '/kb',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        console.log(response);
        $scope.folders=response.data;
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    $scope.get_lvl2 = function(parent_id){
        console.log(parent_id)
        $http.get('/kb/get_lvl2_id'+parent_id).then(function(response){
            console.log(response)
            $scope.lvl2=response.data;
        }).catch(function(err){console.log("something went wrong when getting lvl 2")})
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
}

angular.module('inspinia').controller('kbCtrl', kbCtrl);