function perfil_ctrl($scope, contactService, $state) {


    $scope.perfil=contactService.getContact();
}

angular
    .module('inspinia')
    .controller('perfil_ctrl', perfil_ctrl);