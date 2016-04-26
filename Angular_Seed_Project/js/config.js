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

    .state('outlook', {
        url: "/outlook",
        templateUrl: "page/outlook/outlook.html",
        data: { pageTitle: 'Outlook view', specialClass: 'fixed-sidebar' }
    })

    .state('mailbox', {
        abstract: true,
        url: "/mailbox",
        templateUrl: "views/common/content.html"
    })
    
    .state('mailbox.inbox', {
        url: "/inbox",
        templateUrl: "page/mail/mailbox.html",
        data: { pageTitle: 'Mail Inbox' },
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['css/plugins/iCheck/custom.css','js/plugins/iCheck/icheck.min.js']
                    }
                ]);
            }
        }
    })
    .state('mailbox.email_view', {
        url: "/email_view",
        templateUrl: "page/mail/mail_detail.html",
        data: { pageTitle: 'Mail detail' }
    })
    .state('mailbox.email_compose', {
        url: "/email_compose",
        templateUrl: "page/mail/mail_compose.html",
        data: { pageTitle: 'Mail compose' },
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['css/plugins/summernote/summernote.css','css/plugins/summernote/summernote-bs3.css','js/plugins/summernote/summernote.min.js']
                    },
                    {
                        name: 'summernote',
                        files: ['css/plugins/summernote/summernote.css','css/plugins/summernote/summernote-bs3.css','js/plugins/summernote/summernote.min.js','js/plugins/summernote/angular-summernote.min.js']
                    }
                ]);
            }
        }
    })
    .state('mailbox.email_template', {
        url: "/email_template",
        templateUrl: "page/mail/email_template.html",
        data: { pageTitle: 'Mail compose' }
    })

    .state('contatos', {
        url: "/contatos",
        templateUrl: "page/contatos/contatos.html",
        data: { pageTitle: 'Contatos' }
    })

     .state('calendario', {
        url: "/calendario",
        templateUrl: "page/calendario/calendario.html",
        data: { pageTitle: 'Calendario' },
        resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            files: ['css/plugins/fullcalendar/fullcalendar.css','js/plugins/fullcalendar/fullcalendar.min.js','js/plugins/fullcalendar/gcal.js']
                        },
                        {
                            name: 'ui.calendar',
                            files: ['js/plugins/fullcalendar/calendar.js']
                        }
                    ]);
                }
            }
    })

    .state('projetos', {
        url: "/projetos",
        templateUrl: "page/projetos/project_detail.html",
        data: { pageTitle: 'Projetos' }
    })

     .state('teams_board', {
        url: "/teams_board",
        templateUrl: "page/teams_board/teams_board.html",
        data: { pageTitle: 'Team Board' }
    })

    .state('enquetes', {
        url: "/enquetes",
        templateUrl: "page/enquetes/vote_list.html",
        data: { pageTitle: 'Enquetes' }
    })
    ////////////////
    .state('forum', {
        url: "/forum",
        templateUrl: "page/forum/forum_view.html",
        data: { pageTitle: 'Forum' }
    })
    
    .state('forum.post', {
        url: "/post",
        templateUrl: "page/forum/forum_post_view.html",
        data: { pageTitle: 'Enquetes' }
    })
    
    .state('kb', {
        url: "/kb",
        templateUrl: "page/kb/kb_forum_view.html",
        data: { pageTitle: 'Knowledge Base' }
    })
    
    .state('kb.articles', {
        url: "/articles",
        templateUrl: "page/kb/form_editors.html",
        data: { pageTitle: 'Enviar Artigo' }
    })
    
    .state('kb.upload', {
        url: "/upload",
        templateUrl: "page/kb/file_upload.html",
        data: { pageTitle: 'Enviar Arquivo' }
    })
    
    .state('kb.files', {
        url: "/files",
        templateUrl: "page/kb/file_manager.html",
        data: { pageTitle: 'Visualizar Arquivos' }
    })
}


angular
    .module('inspinia')
    .config(config)
    .run(function($rootScope, $state) {
        $rootScope.$state = $state;
    });
