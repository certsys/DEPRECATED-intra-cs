function kbCtrl($scope, $http) {
    $scope.title = "Base de Conhecimento";

    $scope.treeConfig = {
        'plugins' : [ 'types', 'dnd' ],
        'types' : {
            'default' : {
                'icon' : 'fa fa-folder'
            },
            'html' : {
                'icon' : 'fa fa-file-code-o'
            },
            'svg' : {
                'icon' : 'fa fa-file-picture-o'
            },
            'css' : {
                'icon' : 'fa fa-file-code-o'
            },
            'img' : {
                'icon' : 'fa fa-file-image-o'
            },
            'js' : {
                'icon' : 'fa fa-file-text-o'
            }

        }
    };

    // TODO: Somente para teste, depois era bom esse json vir de outro lugar
    $scope.treeData = [
        { "id" : "certsys", "parent" : "#", "text" : "Certsys", "state": { "opened": true} },
        { "id" : "sccd", "parent" : "certsys", "text" : "IBM Control Desk", "state": { "opened": true} },
        { "id" : "sccd_documentacao", "parent" : "sccd", "text" : "Documentação" },
        { "id" : "sccd_cursos_overview.pdf", "parent" : "sccd_documentacao", "text" : "Overview", "type": "js" },
        { "id" : "sccd_cursos", "parent" : "sccd", "text" : "Cursos" },
        { "id" : "sccd_duvidas", "parent" : "sccd", "text" : "Dúvidas" },
        { "id" : "websphere", "parent" : "certsys", "text" : "IBM WebSphere", "state": { "opened": true} },
        { "id" : "websphere_documentacao", "parent" : "websphere", "text" : "Documentação" },
        { "id" : "websphere_cursos", "parent" : "websphere", "text" : "Cursos" },
        { "id" : "websphere_cursos_conceitos.pdf", "parent" : "websphere_cursos", "text" : "Conceitos de WebSphere", "type": "js" },
        { "id" : "websphere_duvidas", "parent" : "websphere", "text" : "Dúvidas" },
    ];


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
            console.log("Deu ruim!");
            console.log(err);
        });
    };

}

angular.module('inspinia').controller('kbCtrl', kbCtrl);