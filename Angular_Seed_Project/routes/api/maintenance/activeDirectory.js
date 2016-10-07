var ActiveDirectory = require('activedirectory');

exports.getActiveDirectory = function () {
    var activeDirectoryConfigurations = {
        url: 'ldap://192.168.129.2:389',
        baseDN: 'OU=Certsys,DC=certsys,DC=local',
        username: 'svc_intranet@certsys.local',
        password: 'dAgAcupU6rA='
    };

    return new ActiveDirectory(activeDirectoryConfigurations);
};