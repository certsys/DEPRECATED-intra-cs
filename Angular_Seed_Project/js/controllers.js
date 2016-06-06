/**
 * INSPINIA - Responsive Admin Theme
 *
 */

/**
 * MainCtrl - controller
 */
function MainCtrl($http) {
    this.email = {};
    this.userName = 'Example user';
    this.helloText = 'Welcome in SeedProject';
    this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects and dev environment for these projects.';
    $http
        .get('/mailbox/inbox')
        .then(fuction(response){
                this.email = response.data;
              }, 
              fuction(err){
                console.log(err);
              }
            );
    console.log($http);
};

function translateCtrl($translate, $scope) {
    $scope.changeLanguage = function (langKey) {
        $translate.use(langKey);
        $scope.language = langKey;
    };
};



angular
    .module('inspinia')
    .controller('MainCtrl', MainCtrl)
    .controller('translateCtrl', translateCtrl);

