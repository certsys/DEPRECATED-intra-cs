function kbCtrl($scope, $http, $state, userService) {

    $http({
        url: '/kb',
        method: "GET",
        params: {token: userService.getToken()}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response);
    }).catch(function (err) {
        $state.go('login');
        // console.log(err);
    });

    $scope.title = "Base de Conhecimento - Versão Alpha";

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
        { "id" : "db2", "parent" : "certsys", "text" : "IBM DB2", "state": { "opened": true} },
        { "id" : "db2HA.pdf", "parent" : "db2", "text" : "Overview", "type": "js" },

        { "id" : "sccd", "parent" : "certsys", "text" : "IBM Control Desk", "state": { "opened": true} },
        { "id" : "attachment_14772567_Scripting_with_Maximo.pdf", "parent" : "sccd", "text" : "Maximo Scripting", "type": "js" },
        { "id" : "mam_75_logging.pdf", "parent" : "sccd", "text" : "Maximo", "type": "js" },
        { "id" : "Maximo_Logging_and_Troubleshooting_v2.pdf", "parent" : "sccd", "text" : "Maximo Troubleshooting", "type": "js" },
        { "id" : "Scripting with Maximo.pdf", "parent" : "sccd", "text" : "Scripting with Maximo", "type": "js" },

        { "id" : "websphere", "parent" : "certsys", "text" : "IBM WebSphere", "state": { "opened": true} },
        { "id" : "za855", "parent" : "websphere", "text" : "8.5.5" },
        { "id" : "wa8551-va8551stud.pdf", "parent" : "za855", "text" : "Student Notebook", "type": "js" },
        { "id" : "wa8551-va8551xstud.pdf", "parent" : "za855", "text" : "Student Exercises", "type": "js" },
        { "id" : "sg248056.pdf", "parent" : "za855", "text" : "Introduction", "type": "js" },
        { "id" : "SIB - Tudo.pdf", "parent" : "za855", "text" : "Service Integration Bus", "type": "js" },
        { "id" : "scriptza855", "parent" : "za855", "text" : "Scripts" },
        { "id" : "ZA855_Unit01_Script.pdf", "parent" : "scriptza855", "text" : "Unit 1", "type": "js" },
        { "id" : "ZA855_Unit02_Script.pdf", "parent" : "scriptza855", "text" : "Unit 2", "type": "js" },
        { "id" : "ZA855_Unit03_Script.pdf", "parent" : "scriptza855", "text" : "Unit 3", "type": "js" },
        { "id" : "ZA855_Unit04_Script.pdf", "parent" : "scriptza855", "text" : "Unit 4", "type": "js" },
        { "id" : "ZA855_Unit05_Script.pdf", "parent" : "scriptza855", "text" : "Unit 5", "type": "js" },
        { "id" : "ZA855_Unit06_Script.pdf", "parent" : "scriptza855", "text" : "Unit 6", "type": "js" },
        { "id" : "ZA855_Unit07_Script.pdf", "parent" : "scriptza855", "text" : "Unit 7", "type": "js" },
        { "id" : "ZA855_Unit08_Script.pdf", "parent" : "scriptza855", "text" : "Unit 8", "type": "js" },
        { "id" : "ZA855_Unit09_Script.pdf", "parent" : "scriptza855", "text" : "Unit 9", "type": "js" },
        { "id" : "ZA855_Unit10_Script.pdf", "parent" : "scriptza855", "text" : "Unit 10", "type": "js" },
        { "id" : "ZA855_Unit11_Script.pdf", "parent" : "scriptza855", "text" : "Unit 11", "type": "js" },
        { "id" : "ZA855_Unit12_Script.pdf", "parent" : "scriptza855", "text" : "Unit 12", "type": "js" },
        { "id" : "ZA855_Unit13_Script.pdf", "parent" : "scriptza855", "text" : "Unit 13", "type": "js" },
        { "id" : "ZA855_Unit14_Script.pdf", "parent" : "scriptza855", "text" : "Unit 14", "type": "js" },
        { "id" : "ZA855_Unit15_Script.pdf", "parent" : "scriptza855", "text" : "Unit 15", "type": "js" },
        { "id" : "ZA855_Unit16_Script.pdf", "parent" : "scriptza855", "text" : "Unit 16", "type": "js" },
        { "id" : "ZA855_Unit17_Script.pdf", "parent" : "scriptza855", "text" : "Unit 17", "type": "js" },
        { "id" : "ZA855_Unit18_Script.pdf", "parent" : "scriptza855", "text" : "Unit 18", "type": "js" },
        { "id" : "ZA855_Unit19_Script.pdf", "parent" : "scriptza855", "text" : "Unit 19", "type": "js" },
        { "id" : "ZA855_Unit20_Script.pdf", "parent" : "scriptza855", "text" : "Unit 20", "type": "js" },
        { "id" : "ZA855_Unit21_Script.pdf", "parent" : "scriptza855", "text" : "Unit 21", "type": "js" },
        { "id" : "sg247770.pdf", "parent" : "websphere", "text" : "vs 7", "type": "js" }
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
            // console.log();
        }).catch(function (err) {
            //your code in case your post fails
            // console.log(err);
        });
    };
}

angular.module('inspinia').controller('kbCtrl', kbCtrl);