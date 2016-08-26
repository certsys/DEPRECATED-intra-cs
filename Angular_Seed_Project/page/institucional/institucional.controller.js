function institucional($scope, $http, userService, $state) {
	$http({
		url: '/institucional',
		method: "GET",
		params: {token: userService.getToken()}
	}).then(function (response) {
		//your code in case the post succeeds
		// console.log(response);
	}).catch(function (err) {
		$state.go('login');
		// console.log(err);
	});


    $scope.title = "Institucional";

    $scope.name = "Bom dia Certsyanos!!!";
    $scope.subtitulo = "A todos que fazem parte dessa brigada a favor das boas práticas de TI.";

    $scope.intro_0 = "A Intranet foi construída por desenvolvedores para desenvolvedores.";

    $scope.intro_1 = " A Intranet Certsys tem uma missão apenas: unir todos que participam remotamente ou não do ambiente corporativo da empresa, ou seja, todos aqueles que tem o propósito de buscar ou agregar alguma coisa.";
    $scope.intro_2 = "Supondo que todos nós somos aprendizes da entidade Tecnologia e do supremo buscador de informação Google, nossa virtude é nossa capacidade e técnica de buscar e lidar com todo o conjunto de informação e conhecimentos que rondam essa área, nada melhor que temos um local em comum para compartilhar nossas questões e conhecimento.";
    $scope.intro_3 = "Simples assim: se quer ajuda ou ajudar aqui é um ambiente comum para achar pessoas, arquivos e outras coisas que desejar. Não tenha medo de pedir e nem de sugerir alguma coisa estamos aqui pra isso!";

    $scope.assinatura = "Equipe Certsys";

    $scope.institucional = [
        {
            "titulo": "Teste",
            "subtitulo": "Subtitulo Teste",
            "conteudo": "hieaheiuahiue"
        },
        {
            "titulo": "Teste",
            "subtitulo": "Subtitulo Teste",
            "conteudo": "hieaheiuahiue"
        },
        {
            "titulo": "Teste",
            "subtitulo": "Subtitulo Teste",
            "conteudo": "hieaheiuahiue"
        },
        {
            "titulo": "Teste",
            "subtitulo": "Subtitulo Teste",
            "conteudo": "hieaheiuahiue"
        }
    ];
};


angular
    .module('inspinia')
    .controller('institucional', institucional);

