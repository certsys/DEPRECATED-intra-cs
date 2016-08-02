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

     var ADMINS = [
         'augusto.kiramoto',
         'bianca.novo',
         'eduardo.hyodo',
         'henrique.cavalcante',
         'ivan.zoppetti',
         'lucas.felgueiras',
         'pedro.strabeli',
         'stiverson.palma',
         'vanessa.assis'
     ];

     var sendUser = function (newObj) {
         sessionStorage.user = angular.toJson(newObj);
     };

     var getUser = function(){
         return angular.fromJson(sessionStorage.user);
     };

     var sendToken = function (newObj) {
         sessionStorage.token = angular.toJson(newObj);
     };

     var getToken = function(){
         return angular.fromJson(sessionStorage.token);
     };

     var isAdmin = function() {
         for(var i = 0; i < ADMINS.length; i++){
             if (getUser().sAMAccountName == ADMINS[i]) return true;
         }
         return false;
     };

     return {
         sendUser: sendUser,
         getUser: getUser,
         sendToken: sendToken,
         getToken: getToken,
         isAdmin: isAdmin
     };
 }


angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('userService', userService);