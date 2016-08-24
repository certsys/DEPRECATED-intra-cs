 function contactService() {

  var sendContact = function(newObj) {
    d= new Date(newObj.datanasc);
    newObj.datanasc_parsed = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear();
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

angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('userService', userService)
    .service('peopleGroups', peopleGroups);