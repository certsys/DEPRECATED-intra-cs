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


angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)