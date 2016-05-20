
function email($scope){
    $scope.emails = [
                   {mailid: 'check1', read: 'unread', from: 'Anna Smith', tag:'', subject: 'Many desktop publishing packages and web page editors.', attach: 'fa fa-paperclip', date :'6.10 AM'},
                   {mailid: 'check2', read: 'unread', from: 'Jack Nowak', tag:'', subject: 'Aldus PageMaker including versions of Lorem Ipsum.', attach: '', date :'8.22 PM'},
                   {mailid: 'check3', read: 'read', from: 'Facebook', tag: 'Clients', subject: 'Many desktop publishing packages and web page editors.',attach: '',date:'Jan 16'},
                   {mailid: 'check4', read: 'read', from: 'Mailchip', tag: '', subject: 'There are many variations of passages of Lorem Ipsum.',attach: '',date:'Mar 22'},
                   {mailid: 'check5', read: 'read', from: 'Alex T.', tag: 'Documents', subject: 'Lorem ipsum dolor noretek imit set.',attach: 'fa fa-paperclip',date:'December 22'},
                   {mailid: 'check6', read: 'read', from: 'Monica Ryther', tag: '', subject: 'The standard chunk of Lorem Ipsum used.',attach: '',date:'Jun 12'},
                   {mailid: 'check7', read: 'read', from: 'Sandra Derick', tag: '', subject: 'Contrary to popular belief.',attach: '',date:'May 28'},
                   {mailid: 'check8', read: 'read', from: 'Patrick Pertners', tag: '', subject: 'If you are going to use a passage of Lorem',attach: '',date:'May 28'},
                   {mailid: 'check9', read: 'read', from: 'Michael Fox', tag: '', subject: 'Humour, or non-characteristic words etc.',attach: '',date:'Dec 9'},
                   {mailid: 'check10', read: 'read', from: 'Damien Ritz', tag: '', subject: 'Oor Lorem Ipsum is that it has a more-or-less normal.',attach: '',date:'Jun 11'},
                   {mailid: 'check11', read: 'read', from: 'Anna Smith', tag: '', subject: 'Lorem ipsum dolor noretek imit set.',attach: 'fa fa-paperclip',date:'6.10 AM'},
                   {mailid: 'check12', read: 'read', from: 'Jack Nowak', tag: '', subject: 'Aldus PageMaker including versions of Lorem Ipsum.',attach: '',date:'8.22 PM'},
                   {mailid: 'check13', read: 'read', from: 'Mailchip', tag: '', subject: 'There are many variations of passages of Lorem Ipsum.',attach: '',date:'Mar 22'},
                   {mailid: 'check14', read: 'read', from: 'Alex T.', tag: 'Clients', subject: 'Lorem ipsum dolor noretek imit set.',attach: 'fa fa-paperclip',date:'December 22'},
                   {mailid: 'check15', read: 'read', from: 'Monica Ryther', tag: '', subject: 'The standard chunk of Lorem Ipsum used.',attach: '',date:'Jun 12'},
                   {mailid: 'check16', read: 'read', from: 'Sandra Derick', tag: '', subject: 'Contrary to popular belief.',attach: '',date:'May 28'},
                   {mailid: 'check17', read: 'read', from: 'Patrick Pertners', tag: '', subject: 'If you are going to use a passage of Lorem',attach: '',date:'May 28'},
                   {mailid: 'check18', read: 'read', from: 'Michael Fox', tag: '', subject: 'Humour, or non-characteristic words etc.',attach: '' , date:'Dec 9'},
                   {mailid: 'check19', read: 'read', from: 'Damien Ritz', tag: '', subject: 'Oor Lorem Ipsum is that it has a more-or-less normal.',attach: '', date:'Jun 11'}
                   ];
    
};


angular
    .module('inspinia')
    .controller('email', email);