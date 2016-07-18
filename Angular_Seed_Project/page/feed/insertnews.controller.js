function insertnews($scope, $http, $timeout, $state) {
    $scope.title = "Newsfeed CS - Nova postagem";
    
    $scope.thumbnail = [];
    
    $scope.fileReaderSupported = window.FileReader != null;
    
    $scope.photoChanged = function(files) {
      if (files != null) {
        var file = files[0];
        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
            $timeout(function() {
                var fileReader = new FileReader();
                fileReader.readAsDataURL(file); // convert the image to data url. 
                fileReader.onload = function(e) {
                    $timeout(function() {
                        $scope.thumbnail.dataUrl = e.target.result; // Retrieve the im  age. 
                    });
                }
            });
        }
      }
    };
    
    $scope.submit = function () {
        var data = {
            titulo: $scope.titulo,
            imagem: $scope.thumbnail.dataUrl,
            texto: $scope.texto,
            assinatura: $scope.assinatura
       };
        

       var output = angular.toJson(data);
       $http({method: 'POST', url:'/posts', data: output})
           .then(function(response){
           //your code in case the post succeeds
           console.log(response);
           })
           .catch(function(err){
           //your code in case your post fails
           console.log(err);
           });
        
        $state.go('feed');
    };
};

angular
    .module('inspinia')
    .controller('insertnews', insertnews);

