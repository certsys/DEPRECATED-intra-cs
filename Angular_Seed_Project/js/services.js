 function contactService($window) {

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
     var post;

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
     var user;
     var token;

     var sendUser = function (newObj) {
         user = newObj;
     }

     var getUser = function(){
         return user;
     }

     var sendToken = function (newObj) {
         token = newObj;
     }

     var getToken = function(){
         return token;
     }

     return {
         sendUser: sendUser,
         getUser: getUser,
         sendToken: sendToken,
         getToken: getToken
     };
 }


angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)
    .service('userService', userService)