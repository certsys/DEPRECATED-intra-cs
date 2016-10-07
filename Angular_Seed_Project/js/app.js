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
        'infinite-scroll',              // Scroll Infinito
		'ui.switchery',					// Switch iOS 7
        'ngJsTree',                     // Árvore do KB
        'ngImgCrop',                    // Image Crop
        'ngStorage',                    // Armazenamento de dados da sessão Angularizado  
		'ngNumberPicker'                // mínimo e máximo de alunos
    ])
})();


