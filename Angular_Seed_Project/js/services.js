 function contactService() {

  var sendContact = function(newObj) {
      sessionStorage.contact = angular.toJson(newObj); 
  };

  var getContact = function(){
      return angular.fromJson(sessionStorage.contact);
  };

  return {
         sendContact: sendContact,
         getContact: getContact
     };

};

 function postService() {
     var sendPost = function(newObj) {
         sessionStorage.post= angular.toJson(newObj);
     };

     var getPost = function(){
         return angular.fromJson(sessionStorage.post);
     };

     return {
         sendPost: sendPost,
         getPost: getPost
     };

 };


 function userService() {

     var DEV = [
         'eduardo.hyodo',
         'henrique.cavalcante',
         'ivan.zoppetti',
         'lucas.felgueiras',
         'pedro.strabeli'
     ];

     var sendUser = function (newObj) {
         sessionStorage.user = angular.toJson(newObj);
     };

     var getUser = function(){
         return angular.fromJson(sessionStorage.user);
     };

     var sendToken = function(newObj) {
         sessionStorage.token = angular.toJson(newObj);
     };

     var getToken = function(){
         return angular.fromJson(sessionStorage.token);
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

     return {
         sendUser: sendUser,
         getUser: getUser,
         sendToken: sendToken,
         getToken: getToken,
         insideGroup: insideGroup,
         devGroup: devGroup
     };
}

function peopleGroups($http, $q) {
    return {
        ADMINS: function () {
            return $http({
                url: '/users/admins',
                method: "GET"
            }).then(function (response) {
                return (response.data);
            }, function(response) {
                return $q.reject(response.data);
            });
        },

        COMERCIAL: function () {
            return $http({
                url: '/users/comercial',
                method: "GET"
            }).then(function (response) {
                return (response.data);
            }, function(response) {
                return $q.reject(response.data);
            });
        },

        DIRETORES: function () {
            return $http({
                url: '/users/directors',
                method: "GET"
            }).then(function (response) {
                return (response.data);
            }, function(response) {
                return $q.reject(response.data);
            });
        },

        PREVENDAS: function () {
            return $http({
                url: '/users/prevendas',
                method: "GET"
            }).then(function (response) {
                return (response.data);
            }, function(response) {
                return $q.reject(response.data);
            });
        },

        TECNICO: function () {
            return $http({
                url: '/users/tecnico',
                method: "GET"
            }).then(function (response) {
                return (response.data);
            }, function(response) {
                return $q.reject(response.data);
            });
        }
    };
}

angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('userService', userService)
    .service('peopleGroups', peopleGroups);