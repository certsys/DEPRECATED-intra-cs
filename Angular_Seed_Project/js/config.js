/**
 * INSPINIA - Responsive Admin Theme
 *
 * Inspinia theme use AngularUI Router to manage routing and views
 * Each view are defined as state.
 * Initial there are written state for all view in theme.
 *
 */
function compileProvider($compileProvider) {
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|local|data|mailto):/);
}

function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider) {
    $urlRouterProvider.otherwise("/");
    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    //    $locationProvider.html5Mode({
    //      enabled: true//,
    //    //  requireBase: false
    //    });
    $stateProvider
        .state('feed', {
            url: "/feed"
            , templateUrl: "page/feed/feed.html"
            , data: {
                pageTitle: 'Feed de Notícias'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/blueimp/jquery.blueimp-gallery.min.js',
                                'css/plugins/blueimp/css/blueimp-gallery.min.css']
                        },
                        {
                            name: 'pasvaz.bindonce',
                            files: ['js/plugins/bindonce/bindonce.min.js']
                        }
                    ]);
                }
            }
        })


        .state('institucional', {
            url: "/institucional"
            , templateUrl: "page/institucional/institucional.html"
            , data: {
                pageTitle: 'Institucional'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/bootstrap-theme.css',
                                'css/bootstrap-theme.css.map',
                                'css/bootstrap-theme.min.css',
                                'js/pace.min.js',
                                'js/wow.min.js',
                                'js/classie.js',
                                'js/cbpAnimatedHeader.js'


                            ]
                        }
                    ]);
                }
            }
        })
	
	
	
    	
	
    // .state('politicas', {
    //         url: "/institucional/politicas"
    //         , templateUrl: "page/institucional/politicas/politicas.html"
    //         , data: {
    //             pageTitle: 'Políticas'
    //         }
    //         , resolve: {
    //             loadPlugin: function ($ocLazyLoad) {
    //                 return $ocLazyLoad.load([
    //                     {
    //                         files: ['js/pace.min.js',
    //                             'js/wow.min.js',
    //                             'js/classie.js',
    //                             'js/cbpAnimatedHeader.js',
    //                             'css/animate.css',
    //                             'js/plugins/slimscroll/jquery.slimscroll.min.js'
    //
    //
    //
    //
    //                         ]
    //                     }
    //                 ]);
    //             }
    //         }
    //     })
	
	
	

        .state('insertnews', {
            url: "/insertnews"
            , templateUrl: "page/feed/insertnews.html"
            , data: {
                pageTitle: 'Nova Postagem'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                        , {
                            files: ['js/bower_components/summernote/dist/summernote.css'
                                , 'js/bower_components/summernote/dist/summernote.js']
                        }
                        , {
                            files: ['css/plugins/switchery/switchery.css'
                                , 'js/plugins/switchery/switchery.js']
                        }
                        , {
                            name: 'datePicker',
                            files: ['js/plugins/moment/moment.min.js', 'css/plugins/datapicker/angular-datapicker.css',
                                'js/plugins/datapicker/angular-datepicker.js', 'js/plugins/datapicker/pt-br.js']
                        }
                        , {
                            files: ['css/plugins/clockpicker/clockpicker.css',
                                'js/plugins/clockpicker/clockpicker.js']

                        }
                        , {
                            files: ['css/plugins/sweetalert/sweetalert.css', 'js/plugins/sweetalert/sweetalert.min.js']
                        }
                    ]);
                }
            }

        })

        .state('editnews', {
            url: "/editnews"
            , templateUrl: "page/feed/editnews.html"
            , data: {
                pageTitle: 'Editar Postagem'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                        , {
                            files: ['js/bower_components/summernote/dist/summernote.css'
                                , 'js/bower_components/summernote/dist/summernote.js'
                            ]
                        }
                        , {
                            files: ['css/plugins/switchery/switchery.css'
                                , 'js/plugins/switchery/switchery.js']
                        }
                    ]);
                }
            }

        })

        .state('editcontact', {
            url: "/editcontact"
            , templateUrl: "page/contatos/editcontact.html"
            , data: {
                pageTitle: 'Editar Perfil'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'ngTagsInput',
                            files: ['js/plugins/ng-tags-input/ng-tags-input.min.js', 'css/plugins/ng-tags-input/ng-tags-input.min.css', 'css/plugins/ng-tags-input/ng-tags-input.bootstrap.min.css']
                        },
                        {
                            files: ['js/plugins/jasny/jasny-bootstrap.min.js', 'css/plugins/jasny/jasny-bootstrap.min.css']
                        }
                    ]);
                }
            }
        })

        .state('contatos', {
            url: "/contatos",
            templateUrl: "page/contatos/contatos.html",
            data: {pageTitle: 'Contatos'}
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'pasvaz.bindonce',
                            files: ['js/plugins/bindonce/bindonce.min.js']
                        }
                    ]);
                }
            }
        })

        .state('manageposts', {
            url: "/manageposts",
            templateUrl: "page/feed/manageposts.html",
            data: {pageTitle: 'Controlar Posts'}
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/sweetalert/sweetalert.css', 'js/plugins/sweetalert/sweetalert.min.js']
                        },
                        {
                            name: 'pasvaz.bindonce',
                            files: ['js/plugins/bindonce/bindonce.min.js']
                        }
                    ]);
                }
            }

        })
        // .state('insertcontato', {
        //     url: "/insertcontact",
        //     templateUrl: "page/contatos/insertcontact.html",
        //     data: {pageTitle: 'Novo Contato'},
        //     resolve: {
        //         loadPlugin: function ($ocLazyLoad) {
        //             return $ocLazyLoad.load([
        //                 {
        //                     files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
        //                 },
        //                 {
        //                     name: 'ngTagsInput',
        //                     files: ['js/plugins/ng-tags-input/ng-tags-input.min.js', 'css/plugins/ng-tags-input/ng-tags-input.min.css', 'css/plugins/ng-tags-input/ng-tags-input.bootstrap.min.css']
        //                 },
        //                 {
        //                     files: ['js/plugins/jasny/jasny-bootstrap.min.js', 'css/plugins/jasny/jasny-bootstrap.min.css']
        //                 }
        //             ]);
        //         }
        //     }
        // })

        .state('kb', {
            url: "/kb",
            templateUrl: "page/kb/kb.html",
            data: {pageTitle: 'Base de Conhecimento'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/jsTree/jstree.min.js', 'css/plugins/jsTree/style.min.css']
                        }
                    ]);
                }
            }
        })
        .state('kb2',{
            url: "/kb2",
            templateUrl: "page/kb/dummy_sample_page.html",
            data: {pageTitle: 'Base de Conhecimento'},
            controller: "kbCtrl",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                           // files: ['js/plugins/jsTree/jstree.min.js', 'css/plugins/jsTree/style.min.css']
                        }
                    ]);
                }
            }
        })
        .state('kb_insert', {
            url: "/kb_insert",
            templateUrl: "page/kb/insertkb.html",
            data: {pageTitle: 'Inserir na Base de Conhecimento'},
            controller: "kb_insert",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },{
                            files: ['js/bower_components/summernote/dist/summernote.css', 'js/bower_components/summernote/dist/summernote.js'
                            ]
                        }
                        , {
                            files: ['css/plugins/switchery/switchery.css', 'js/plugins/switchery/switchery.js']
                        },{
                            files: ['js/plugins/jsTree/jstree.min.js', 'css/plugins/jsTree/style.min.css']
                        }
                    ]);
                }
            }
        })

        .state('insertkb', {
            url: "/insertkb",
            templateUrl: "page/kb/kb_subscribe.html",
            data: {pageTitle: 'Cadastrar novo item'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })

        .state('perfil', {
            url: "/perfil",
            templateUrl: "page/perfil/perfil.html",
            controller: "perfil_ctrl",
            data: {pageTitle: 'Perfil'},
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
	
	
	
	//página universidade certsys
	.state('universidade', {
            url: "/universidade",
            templateUrl: "page/universidade/universidade.html",
            data: {pageTitle: 'Universidade Certsys'},
            controller: "universidade",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'pasvaz.bindonce',
                            files: ['js/plugins/bindonce/bindonce.min.js']
                        }
                    ]);
                }
            }
        })
    .state('universidade_manage', {
            url: "/universidade/gerenciar_curso",
            templateUrl: "page/universidade/gerenciar_curso.html",
            data: {pageTitle: 'Gerenciar Curso | Universidade Certsys'},
            controller: "gerenciar_curso",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        
                        {
                            files: ['js/bower_components/summernote/dist/summernote.css', 'js/bower_components/summernote/dist/summernote.js'
                            ]
                        }, 
                        {
                            files: ['css/plugins/switchery/switchery.css', 'js/plugins/switchery/switchery.js']
                        }
                    ]);
                }
            }
        })
	
	
	
	
    // .state('outlook', {
    //     url: "/outlook"
    //     , templateUrl: "page/outlook/outlook.html"
    //     , data: {
    //         pageTitle: 'Outlook view'
    //         , specialClass: 'fixed-sidebar'
    //     }
    // }).state('mailbox', {
    //     abstract: true
    //     , url: "/mailbox"
    //     , templateUrl: "views/common/content.html"
    // }).state('mailbox.inbox', {
    //     url: "/inbox"
    //     , templateUrl: "page/mail/mailbox.html"
    //     , data: {
    //         pageTitle: 'Mail Inbox'
    //     }
    //     , resolve: {
    //         loadPlugin: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 {
    //                     files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
    //                 }
    //             ]);
    //         }
    //     }
    // }).state('mailbox.email_view', {
    //     url: "/email_view"
    //     , templateUrl: "page/mail/mail_detail.html"
    //     , data: {
    //         pageTitle: 'Mail detail'
    //     }
    // }).state('mailbox.email_compose', {
    //     url: "/email_compose"
    //     , templateUrl: "page/mail/mail_compose.html"
    //     , data: {
    //         pageTitle: 'Mail compose'
    //     }
    //     , resolve: {
    //         loadPlugin: function ($ocLazyLoad) {
    //             return $ocLazyLoad.load([
    //                 {
    //                     files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js']
    //                 }
    //                 , {
    //                     name: 'summernote'
    //                     ,
    //                     files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
    //                 }
    //             ]);
    //         }
    //     }
    // })
    //
    //     .state('mailbox.email_template', {
    //         url: "/email_template",
    //         templateUrl: "page/mail/email_template.html",
    //         data: {pageTitle: 'Mail compose'}
    //     })
    //
    //
    //     .state('calendario', {
    //         url: "/calendario",
    //         templateUrl: "page/calendario/calendario.html",
    //         data: {pageTitle: 'Calendario'},
    //         resolve: {
    //             loadPlugin: function ($ocLazyLoad) {
    //                 return $ocLazyLoad.load([
    //                     {
    //                         insertBefore: '#loadBefore'
    //                         ,
    //                         files: ['css/plugins/fullcalendar/fullcalendar.css', 'js/plugins/fullcalendar/fullcalendar.min.js', 'js/plugins/fullcalendar/gcal.js']
    //                     }
    //                     , {
    //                         name: 'ui.calendar'
    //                         , files: ['js/plugins/fullcalendar/calendar.js']
    //                     }
    //                 ]);
    //             }
    //         }
    //     })
    //     // .state('projetos', {
    //     //       url: "/projetos",
    //     //       templateUrl: "page/projetos/project_detail.html",
    //     //       data: { pageTitle: 'Projetos' }
    //     //     })
    //     .state('teams_board', {
    //         url: "/teams_board"
    //         , templateUrl: "page/teams_board/teams_board.html"
    //         , data: {
    //             pageTitle: 'Team Board'
    //         }
    //     }).state('enquetes', {
    //     url: "/enquetes"
    //     , templateUrl: "page/enquetes/vote_list.html"
    //     , data: {
    //         pageTitle: 'Enquetes'
    //     }
    // })
    // ////////////////
    //     .state('forum', {
    //         url: "/forum"
    //         , abstract: true
    //         , templateUrl: "views/common/content.html"
    //     }).state('forum.view', {
    //     url: "/view"
    //     , templateUrl: "page/forum/forum_view.html"
    //     , data: {
    //         pageTitle: 'Forum'
    //     }
    // }).state('forum.new_post', {
    //     url: "/new_post"
    //     , templateUrl: "page/forum/form_editors.html"
    //     , data: {
    //         pageTitle: 'Novo Post'
    //     }
    // }).state('forum.post', {
    //     url: "/post"
    //     , templateUrl: "page/forum/forum_post_view.html"
    //     , data: {
    //         pageTitle: 'Post'
    //     } //este aqui tem que ser acessado pelo clique do post no forum.view
    // })
    // //     .state('kb', {
    // //     url: "/kb"
    // //     , abstract: true
    // //     , templateUrl: "views/common/content.html"
    // //     //data: { pageTitle: 'Knowledge Base' }
    // // })
    //     .state('kb.view', {
    //     url: "/view"
    //     , templateUrl: "page/kb/kb_forum_view.html"
    //     , data: {
    //         pageTitle: 'Knowledge Base'
    //     }
    // }).state('kb.articles', {
    //     url: "/new_article"
    //     , templateUrl: "page/kb/form_editors.html"
    //     , data: {
    //         pageTitle: 'Enviar Artigo'
    //     }
    // }).state('kb.upload', {
    //     url: "/upload"
    //     , templateUrl: "page/kb/file_upload.html"
    //     , data: {
    //         pageTitle: 'Enviar Arquivo'
    //     }
    // }).state('kb.files', {
    //     url: "/files"
    //     , templateUrl: "page/kb/file_manager.html"
    //     , data: {
    //         pageTitle: 'Visualizar Arquivos'
    //     }
    // })
    .state('kb.article', {
        url: "/article"
        , templateUrl: "page/kb/article.html"
        , data: {
            pageTitle: 'Visualizar Artigo'
        }
    }) //Este será usado quando houver um artigo a ser visto. abrirá nesta página
        .state('login', {
            url: "/"
            , templateUrl: "page/login/login.html"
            , data: {
                pageTitle: 'Login'
            }
            , resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/sweetalert/sweetalert.css', 'js/plugins/sweetalert/sweetalert.min.js']
                        }
                    ]);
                }
            }
        }) //Tela de Login
        .state('register', {
            url: "/register"
            , templateUrl: "page/register/register.html"
            , data: {
                pageTitle: 'Registrar-se'
            }
        }) //Tela de Registro
}
angular.module('inspinia').config(config).config(compileProvider).run(function ($rootScope, $state) {
    $rootScope.$state = $state;
});