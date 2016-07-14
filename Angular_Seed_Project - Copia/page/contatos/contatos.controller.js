function contacts($scope){
    $scope.contatos = [
    	{id: "98273yguhrewnfds", name: "John Smith", maintool:"Websphere", mail:"john.smith@certsys.com.br", phone: "(11)99999-9999", skype:"john_smith", img: "img/a2.jpg"}
	];
};


angular
    .module('inspinia')
   .controller('contacts',contacts);

