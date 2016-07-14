function insertnews($scope, $http){
	$scope.submit= function(){
		var data = $.param({
			book: JSON.stringify({
				titulo: $scope.titulo,
				imagem: $scope.imagem,
				texto: $scope.texto,
				assinatura: $scope.assinatura
			})
		});

		$http.post("/posts", data).success(function(data, status) {
			console.log('Data posted successfully');
		})
	}
};

angular
    .module('inspinia')
   .controller('insertnews',insertnews);

