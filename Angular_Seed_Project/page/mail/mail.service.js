//function getEmail($http, $q){
//    var emails=this;
//    emails.maillist={};
//    emails.getMail= function(){
//        var defer = $q.defer();
//        $http.get('/mailbox/inbox').success(function(res){
//            emails.maillist=res;
//            defer.resolve(res);    
//        })
//        .error(function(){
//            defer.reject(err);
//        })
//        return defer.promise
//    }
//
//    return emails;
//}
//
//angular
//    .module('inspinia')
//    .service('getEmail', getEmail);
////try