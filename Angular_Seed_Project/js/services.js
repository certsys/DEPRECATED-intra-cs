function contactService($sessionStorage) {

    var sendContact = function (newObj) {
        var d = new Date(newObj.datanasc);
        newObj.datanasc_parsed = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
        $sessionStorage.contact = angular.toJson(newObj);

    };

    var getContact = function () {

        return angular.fromJson($sessionStorage.contact);
    };

    return {
        sendContact: sendContact,
        getContact: getContact
    };

};

function postService($sessionStorage) {
    var sendPost = function (newObj) {
        $sessionStorage.post = angular.toJson(newObj);
    };

    var getPost = function () {
        return angular.fromJson($sessionStorage.post);
    };

    return {
        sendPost: sendPost,
        getPost: getPost
    };

};

function universidadeService($sessionStorage) {

    var salvou = false;

    var sendCurso = function (newObj) {
        $sessionStorage.curso = angular.toJson(newObj);
    };

    var getCurso = function () {
        return angular.fromJson($sessionStorage.curso);
    };

    var sendSalvou = function (newObj) {
        salvou = newObj;
    };

    var getSalvou = function () {
        return salvou;
    };


    return {
        sendCurso: sendCurso,
        getCurso: getCurso,
        sendSalvou: sendSalvou,
        getSalvou: getSalvou
    };

};

function userService($sessionStorage, peopleGroups) {

    var DEV = [
        'eduardo.hyodo',
        'henrique.cavalcante',
        'ivan.zoppetti',
        'lucas.felgueiras',
        'pedro.strabeli'
        //'marcos.hosoya'
    ];

    var INSTRUCTORS = [
        'carlos.custodio',
        'herbert.santos',
        'henrique.cavalcante'
       // 'marcos.hosoya'
    ];

    // temp code refazer posteriormente
    var RH = [
        'vanessa.assis',
        'bianca.novo',
        "elizabeth.kurihara"
    ];
    // =======


    var sendUser = function (newObj) {
        $sessionStorage.user = angular.toJson(newObj);
    };

    var getUser = function () {
         return angular.fromJson($sessionStorage.user);
        // return {
        //     cn: "Abner Correa Junior"
        // }
    };

    var sendToken = function (newObj) {
        $sessionStorage.token = angular.toJson(newObj);
    };

    var getToken = function () {
        return angular.fromJson($sessionStorage.token);
    };

    var insideGroup = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (getUser().sAMAccountName == array[i]) return true;
        }
        return false;
    };

    var devGroup = function () {
        for (var i = 0; i < DEV.length; i++) {
            if (getUser().sAMAccountName == DEV[i]) return true;
        }
        return false;
    };

    var instructorGroup = function () {
        for (var i = 0; i < INSTRUCTORS.length; i++) {
            if (getUser().sAMAccountName == INSTRUCTORS[i]) return true;
        }
        return false;
    };

    // temp code
    var rhGroup = function () {
        for (var i = 0; i < RH.length; i++) {
            if (getUser().sAMAccountName == RH[i]) return true;
        }
        return false;
    };
    // =====

    var Authenticate = function () {
        $sessionStorage.permissions = {

            debug: false,
            admin: false,
            comercial: false,
            diretores: false,
            prevendas: false,
            tecnico: false,
            instructors: false,
            rh: false // temp code
        };

        if (devGroup()) $sessionStorage.permissions.debug = true;
        if (instructorGroup()) $sessionStorage.permissions.instructors = true;
        if (rhGroup()) $sessionStorage.permissions.rh = true; // temporary code

        peopleGroups.GROUPS()
            .then(function (data) {
                if (angular.isDefined(data)) {
                    for (var i = 0; i < data.length; i++) {
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.admin = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.comercial = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.diretores = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.prevendas = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.tecnico = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.rh = true;  // temp code
                    }
                }
            }, function (error) {
                console.log('error', error);
            });

        // if (!($sessionStorage.permissions.debug || $sessionStorage.permissions.admin || $sessionStorage.permissions.diretores))
        //     $state.go('feed');

        return $sessionStorage.permissions;

        // Só administradores do sistema podem entrar nessa view
        // if(!userService.isAdmin())
        //     $state.go('feed')
    };

    return {
        sendUser: sendUser,
        getUser: getUser,
        sendToken: sendToken,
        getToken: getToken,
        insideGroup: insideGroup,
        devGroup: devGroup,
        Authenticate: Authenticate,
        instructorGroup: instructorGroup,
        rhGroup: rhGroup // temp code
    };
}

function peopleGroups($http, $q) {
    var GROUPS = function () {
        return $http({
            url: '/groups',
            method: "GET"
        }).then(function (response) {
            return (response.data);
        }, function (response) {
            return $q.reject(response.data);
        });
    };

    return {
        GROUPS: GROUPS
    };
}

String.prototype.startWith = function (str) {
    return this.indexOf(str) == 0;
};

'use strict';
function linkFilter() {
    return function (link) {
        var result;
        var startingUrl = "http://";
        var httpsStartingUrl = "https://";
        if (link.startWith(startingUrl) || link.startWith(httpsStartingUrl)) {
            result = link;
        }
        else {
            result = startingUrl + link;
        }
        return result;
    }
}

function fileUpload($http){
    this.uploadFileToUrl = function(file, uploadUrl){
       var fd = new FormData();
       fd.append('files', file, file.name);
        console.log(fd)
       $http.post(uploadUrl, fd, {
          transformRequest: angular.identity,
          headers: {'Content-Type': undefined}
       })
       .then(function(response){
        var data = {_id: _id,
            originalFilename: response.data}
         $http.post(uploadUrl+'2', data). //2 é a rota que acrescenta no mongo.
         then(function(response){console.log("ok")}).catch(function(err){console.log(err)})
       })
       .catch(function(){

       });
    }
}



angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('universidadeService', universidadeService)
    .service('userService', userService)
    .service('peopleGroups', peopleGroups)
    .service('fileUpload', fileUpload)
    .filter('linkFilter', linkFilter);