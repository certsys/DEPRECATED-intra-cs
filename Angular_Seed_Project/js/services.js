 function contactService($sessionStorage) {

  var sendContact = function(newObj) {
    d= new Date(newObj.datanasc);
    newObj.datanasc_parsed = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
    sessionStorage.contact = angular.toJson(newObj);
  };

  var getContact = function(){
      return angular.fromJson($sessionStorage.contact);
  };

  return {
         sendContact: sendContact,
         getContact: getContact
     };

};

 function postService($sessionStorage) {
     var sendPost = function(newObj) {
         $sessionStorage.post= angular.toJson(newObj);
     };

     var getPost = function(){
         return angular.fromJson($sessionStorage.post);
     };

     return {
         sendPost: sendPost,
         getPost: getPost
     };

 };

  function universidadeService($sessionStorage) {

  var sendCurso = function(newObj) {
    sessionStorage.curso = angular.toJson(newObj);
  };

  var getCurso = function(){
      return angular.fromJson($sessionStorage.curso);
  };

  return {
         sendCurso: sendCurso,
         getCurso: getCurso
     };

};

 function userService($sessionStorage, peopleGroups) {

     var DEV = [
         'eduardo.hyodo',
         'henrique.cavalcante',
         'ivan.zoppetti',
         'lucas.felgueiras',
         'pedro.strabeli',
         'marcos.hosoya'
     ];

     var INSTRUCTORS  = [
         'carlos.custodio',
         'herbert.santos'
         //'marcos.hosoya'
     ];

     
     var sendUser = function (newObj) {
         $sessionStorage.user = angular.toJson(newObj);
     };

     var getUser = function(){
         return angular.fromJson($sessionStorage.user);
     };

     var sendToken = function(newObj) {
         $sessionStorage.token = angular.toJson(newObj);
     };

     var getToken = function(){
         return angular.fromJson($sessionStorage.token);
     };

     var insideGroup = function(array) {
         for (var i = 0; i < array.length; i++) {
             if (getUser().sAMAccountName == array[i]) return true;
         }
         return false;
     };

     var devGroup = function() {
         for (var i = 0; i < DEV.length; i++) {
             if (getUser().sAMAccountName == DEV[i]) return true;
         }
         return false;
     };

     var instructorGroup = function() {
         for (var i = 0; i < INSTRUCTORS.length; i++) {
             if (getUser().sAMAccountName == INSTRUCTORS[i]) return true;
         }
         return false;
     };

    var Authenticate = function(){
         $sessionStorage.permissions = {
            debug: false,
            admin: false,
            comercial: false,
            diretores: false,
            prevendas: false,
            tecnico: false,
            instructors: false
        };

        if (devGroup()) $sessionStorage.permissions.debug = true;
        if (instructorGroup()) $sessionStorage.permissions.instructors = true;

        peopleGroups.GROUPS()
            .then(function (data) {
                if (angular.isDefined(data)) {
                    for (var i=0; i<data.length; i++){
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.admin = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.comercial = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.diretores = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.prevendas = true;
                        if (insideGroup(data[i].users)) $sessionStorage.permissions.tecnico = true;
                    }
                }
            }, function (error) {
                console.log('error', error);
            });

        if (!($sessionStorage.permissions.debug || $sessionStorage.permissions.admin || $sessionStorage.permissions.diretores))
            $state.go('feed');

        // Só administradores do sistema podem entrar nessa view
        // if(!userService.isAdmin())
        //     $state.go('feed')
    }

     return {
         sendUser: sendUser,
         getUser: getUser,
         sendToken: sendToken,
         getToken: getToken,
         insideGroup: insideGroup,
         devGroup: devGroup,
         Authenticate: Authenticate
     };
}

function peopleGroups($http, $q) {
    var GROUPS = function () {
        return $http({
            url: '/groups',
            method: "GET"
        }).then(function (response) {
            return (response.data);
        }, function(response) {
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
         if(link.startWith(startingUrl)||link.startWith(httpsStartingUrl)){
             result = link;
         }
         else {
             result = startingUrl + link;
         }
         return result;
     }
 }


angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('universidadeService', universidadeService)
    .service('userService', userService)
    .service('peopleGroups', peopleGroups)
    .filter('linkFilter', linkFilter);