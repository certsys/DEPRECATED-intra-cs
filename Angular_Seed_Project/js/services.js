 function contactService() {
  var contact;

  var sendContact = function(newObj) {
      contact= newObj; 
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


angular
    .module('inspinia')
    .service('contactService', contactService)
    .service('postService', postService)