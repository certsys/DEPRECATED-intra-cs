 function contactService() {
  var contact;

  var sendContact = function(newObj) {
      contact = newObj; 
  };

  var getContact = function(){
      console.log(contact)
      return contact;
  };

  return {
         sendContact: sendContact,
         getContact: getContact
     };

};

 function postService() {
     var post;

     var sendPost = function(newObj) {
         post= newObj;
     };

     var getPost = function(){
         console.log(post)
         return post;
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