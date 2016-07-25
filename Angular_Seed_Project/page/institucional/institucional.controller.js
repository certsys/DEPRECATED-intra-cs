function institucional($scope) {
       
    $scope.title = "Institucional"; 

    $scope.name = "Intranet Certsys";

    $scope.intro = "Escreva aqui seu texto introdutório";

    $scope.institucional = [
    	{
    		"titulo":"Teste",
    		"subtitulo":"Subtitulo Teste",
    		"conteudo":"hieaheiuahiue"
    	},
    	{
    		"titulo":"Teste",
    		"subtitulo":"Subtitulo Teste",
    		"conteudo":"hieaheiuahiue"
    	},
    	{
    		"titulo":"Teste",
    		"subtitulo":"Subtitulo Teste",
    		"conteudo":"hieaheiuahiue"
    	},
    	{
    		"titulo":"Teste",
    		"subtitulo":"Subtitulo Teste",
    		"conteudo":"hieaheiuahiue"
    	}
	];
};

    

angular
    .module('inspinia')
    .controller('institucional', institucional);

