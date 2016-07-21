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


angular
    .module('inspinia')
    .service('contactService', contactService)