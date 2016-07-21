/**
 * INSPINIA - Responsive Admin Theme
 *
 */
(function () {
    angular.module('inspinia', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'pascalprecht.translate',       // Angular Translate
        'ui.bootstrap',                 // Ui Bootstrap
        'summernote',                   // Summernote Editor de Texto
        'ngSanitize',                   // Para display de código HTML
        'infinite-scroll'               // Scroll Infinito
    ])
    .filter('highlight', function($sce) {
    return function(text, phrase) {
      if (phrase) text = text.replace(new RegExp('('+phrase+')', 'gi'),
        '<span class="highlighted">$1</span>')

      return $sce.trustAsHtml(text)
    }})
})();
