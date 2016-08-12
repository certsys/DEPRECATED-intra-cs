function editcontact($scope, $http, $state, userService, contactService) {

    // Somente permite editar o próprio contato
    $http({
        url: '/contacts/perfil',
        method: "GET",
        params: {token: userService.getToken(), mail: userService.getUser().sAMAccountName}
    }).then(function (response) {
        //your code in case the post succeeds
        // console.log(response.data.lenght > 0);
        contactService.sendContact(response.data[0]);
        $scope.carregaDados();
        if(response.data.length > 0) {
        }else{
            alert("Infelizmente o seu usuário ainda não tem dados no sistema :(")
        }
    }).catch(function (err) {
        $state.go('login');
        console.log(err);
    });

    $scope.title = 'Editar Perfil';

    $scope.myImage='';
    $scope.myCroppedImage='';

    var handleFileSelect=function(evt) {
        var file=evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function (evt) {
            $scope.$apply(function($scope){
                $scope.myImage=evt.target.result;
            });
        };
        reader.readAsDataURL(file);
    };
    angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

    $scope.carregaDados = function () {
        $scope.edit_perfil = contactService.getContact();
        $scope.maintools = [];
        $scope.tools_basic = [];
        $scope.tools_intermediate = [];
        $scope.tools_advanced = [];

        if (angular.isDefined($scope.edit_perfil.tooltable)) {
            for (var i = 0; i < $scope.edit_perfil.tooltable.tools_advanced.length; i++) {
                var tool = $scope.edit_perfil.tooltable.tools_advanced[i];
                // Criar tag padrão do sistema de TAGs com base no nome
                var tag = tool.replace(/®/g, "").replace(/™/g, "").replace(/ /g, "-").replace(/ /g, "-").toLowerCase();
                if (tag[tag.length - 1] === '-') tag[tag.length - 1] = "";

                var objeto_tag = {
                    worktool: tag, name: tool
                }

                $scope.tools_advanced.push(objeto_tag);
            }

            for (var i = 0; i < $scope.edit_perfil.tooltable.tools_intermediate.length; i++) {
                var tool = $scope.edit_perfil.tooltable.tools_intermediate[i];
                // Criar tag padrão do sistema de TAGs com base no nome
                var tag = tool.replace(/®/g, "").replace(/™/g, "").replace(/ /g, "-").replace(/ /g, "-").toLowerCase();
                if (tag[tag.length - 1] === '-') tag[tag.length - 1] = "";

                var objeto_tag = {
                    worktool: tag, name: tool
                }

                $scope.tools_intermediate.push(objeto_tag);
            }

            for (var i = 0; i < $scope.edit_perfil.tooltable.tools_basic.length; i++) {
                var tool = $scope.edit_perfil.tooltable.tools_basic[i];
                // Criar tag padrão do sistema de TAGs com base no nome
                var tag = tool.replace(/®/g, "").replace(/™/g, "").replace(/ /g, "-").replace(/ /g, "-").toLowerCase();
                if (tag[tag.length - 1] === '-') tag[tag.length - 1] = "";

                var objeto_tag = {
                    worktool: tag, name: tool
                }

                $scope.tools_basic.push(objeto_tag);
            }
        }

    };


    $scope.loadTools = function ($query) {
        return $http.get('tools.json', {cache: true}).then(function (response) {
            var tools = response.data;
            $scope.backup_tools = response.data;
            return tools.filter(function (tool) {
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

    // $scope.thumbnail = [];
    // $scope.fileReaderSupported = window.FileReader != null;
    // $scope.photoChanged = function (files) {
    //     if (files != null) {
    //         var file = files[0];
    //         if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
    //             $timeout(function () {
    //                 var fileReader = new FileReader();
    //                 fileReader.readAsDataURL(file); // convert the image to data url.
    //                 fileReader.onload = function (e) {
    //                     $timeout(function () {
    //                         $scope.thumbnail.dataUrl = e.target.result; // Retrieve the im  age.
    //                     });
    //                 }
    //             });
    //         }
    //     }
    // };


    $scope.edit = function () {
        var basic_array = [];
        var inter_array = [];
        var advanced_array = [];
        var log = [];
        for (var i = 0; i < $scope.tools_basic.length; i++) {
            angular.forEach($scope.tools_basic[i], function (value, key) {
                if (key != "$$hashKey" && key != "worktool") basic_array.push(value);
            }, log);
        }
        for (var i = 0; i < $scope.tools_intermediate.length; i++) {
            angular.forEach($scope.tools_intermediate[i], function (value, key) {
                if (key != "$$hashKey" && key != "worktool") inter_array.push(value);
            }, log);
        }

        for (var i = 0; i < $scope.tools_advanced.length; i++) {
            angular.forEach($scope.tools_advanced[i], function (value, key) {
                if (key != "$$hashKey" && key != "worktool") advanced_array.push(value);
            }, log);
        }

        var tooltable = {
            // maintools : $scope.maintools,
            tools_basic: basic_array,
            tools_intermediate: inter_array,
            tools_advanced: advanced_array
        };

        var data = {
            sobre: $scope.edit_perfil.sobre,
            tooltable: tooltable,
            telefone: $scope.edit_perfil.telefone,
            skype: $scope.edit_perfil.skype,
            linkedin: $scope.edit_perfil.linkedin,
            imagem: $scope.myCroppedImage
        };

        var output = JSON.stringify(data);
        console.log(output);

        $http({
            method: 'PUT'
            , url: '/contacts/edit/'
            , data: data
            , params: {token: userService.getToken(), mail: userService.getUser().mail}
        }).then(function (response) {
            //your code in case the post succeeds
            console.log(response.data);
            contactService.sendContact(response.data);
            $state.go('perfil');
        }).catch(function (err) {
            //your code in case your post fails
            console.log(err);
        });
    }

};

angular
    .module('inspinia')
    .controller('editcontact', editcontact);
