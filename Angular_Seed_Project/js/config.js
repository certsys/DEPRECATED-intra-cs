/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {
    $urlRouterProvider.otherwise("/pagina-principal");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
    .state('pagina_principal', {
          url: "/pagina-principal",
          templateUrl: "page/home/home.html",
          data: { pageTitle: 'Pagina Principal' },
          resolve: {
              loadPlugin: function ($ocLazyLoad) {
                  return $ocLazyLoad.load([
                      {
                          serie: true,
                          name: 'angular-flot',
                          files: [ 'js/plugins/flot/jquery.flot.js', 'js/plugins/flot/jquery.flot.time.js', 'js/plugins/flot/jquery.flot.tooltip.min.js', 'js/plugins/flot/jquery.flot.spline.js', 'js/plugins/flot/jquery.flot.resize.js', 'js/plugins/flot/jquery.flot.pie.js', 'js/plugins/flot/curvedLines.js', 'js/plugins/flot/angular-flot.js', ]
                      },
                      {
                          files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                      },
                      {
                          files: ['js/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js', 'js/plugins/jvectormap/jquery-jvectormap-2.0.2.css']
                      },
                      {
                          files: ['js/plugins/jvectormap/jquery-jvectormap-world-mill-en.js']
                      },
                      {
                          name: 'ui.checkbox',
                          files: ['js/bootstrap/angular-bootstrap-checkbox.js']
                      }
                  ]);
              }
          }
      })

    .state('perfil', {
        url: "/perfil",
        templateUrl: "page/perfil/perfil.html",
        data: { pageTitle: 'Perfil'},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/sparkline/jquery.sparkline.min.js']
                    }
                ]);
            }
        }
    })

}
angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
