function perfil_ctrl($scope, contactService) {


    $scope.perfil=contactService.getContact();
    console.log($scope.perfil);

}

angular
    .module('inspinia')
    .controller('perfil_ctrl', perfil_ctrl);