function modalDemoCtrl($scope, $modal) {

    $scope.open = function () {

        var modalInstance = $modal.open({
            templateUrl: 'page/modais/modalUniversidade.html',
            controller: ModalInstanceCtrl
        });
    }
   
};

function ModalInstanceCtrl ($scope, $modalInstance) {

    $scope.ok = function () {
        $modalInstance.close();
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
	
};



angular
    .module('inspinia')
    .controller('modalDemoCtrl', modalDemoCtrl)
    .controller('ModalInstanceCtrl', ModalInstanceCtrl);