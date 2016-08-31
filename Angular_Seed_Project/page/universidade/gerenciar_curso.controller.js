function gerenciar_curso($scope, $http, userService, fileUpload, $state ) {
	$http({
		url: '/cursos',
		method: "GET",
		params: {token: userService.getToken()}
	}).then(function (response) {
		//your code in case the post succeeds
		// console.log(response);
	}).catch(function (err) {
		$state.go('login');
		// console.log(err);
	});

    $scope.title = "Gerenciar curso | ";
    $scope.curso;


    // upload de arquivos
    $scope.uploadFile = function(){
	var file = $scope.myFile;

	console.log('file is ' );
	console.dir(file);

	var uploadUrl = "/cursos/uploadfile";
	fileUpload.uploadFileToUrl(file, uploadUrl);
	};


	//download de arquivos
	$scope.downloadFile=function(filename, cursoId){
		$http.post('/cursos/download',{filename: filename, cursoId: cursoId})
		.then(function(response){

		}).catch(function(err){console.log(err)})
	}


// 	$scope.uploadFile = function(){
//  	$scope.fileSelected = function(files) {
//      if (files && files.length) {
//         $scope.file = files[0];
//      }
//      $upload.upload({
//        url: '/cursos/uploadfile', //node.js route
//        file: $scope.file
//      })
//      .success(function(data) {
//        console.log(data, 'uploaded');
//       });
//     };
// };
};



angular
    .module('inspinia')
    .controller('gerenciar_curso', gerenciar_curso);

