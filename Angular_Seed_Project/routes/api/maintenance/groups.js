var express = require('express');
var async = require('async');
var router = express.Router();
var Group = require('../../../models/groups');


router.post('/admins', function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[0], function (err, isMember) {
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[0]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[0],
                            users: admins,
                            permissions: true
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});

router.post('/comercial', function (req, res, next) {
    var admins = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[1], function (err, isMember) {
                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[1]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[1],
                            users: admins,
                            permissions: false
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});

router.post('/directors', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[2], function (err, isMember) {

                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        return callback(err);
                    } else
                        return callback(null, user.sAMAccountName);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[2]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[2],
                            users: admins,
                            permissions: true
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});

router.post('/prevendas', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[5], function (err, isMember) {

                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[5]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[5],
                            users: admins,
                            permissions: false
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});

router.post('/tecnico', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[6], function (err, isMember) {

                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[6]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[6],
                            users: admins,
                            permissions: false
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});


router.post('/rh', function (req, res, next) {
    var admins = [];
    var calls = [];
    ad.getUsersForGroup(groupName, function (err, users) {
        if (err) {
            res.json('ERROR: ' + JSON.stringify(err));
            return;
        }

        if (!users) res.json({data: 'Group: ' + groupName + ' not found.'});
        else {
            async.each(users, function (user, callback) {
                ad.isUserMemberOf(user.sAMAccountName, GROUPS[7], function (err, isMember) {

                    if (isMember) {
                        admins.push(user.sAMAccountName);
                    }
                    if (err) {
                        console.log('ERROR: ' + JSON.stringify(err));
                        callback(err);
                    } else
                        callback(null);
                });
            }, function (err) {
                if (err) return console.log(err);
                Group.findOne({name: GROUPS[7]}, function (err, data) {
                    if (err) return err;
                    else if (data == null) {
                        var newGroup = new Group({
                            name: GROUPS[7],
                            users: admins,
                            permissions: false
                        });

                        newGroup.save(function (err) {
                            if (err) return err;
                        });
                    }
                    else if (data != null) {
                        data.users = admins;
                        data.save(function (err, data) {
                            if (err) return next(err);
                        });
                    }
                });
                res.json(null);
            });
        }
    });
});

router.get('/', function (req, res, next) {
    Group.find(function (err, group) {
        if (err) return console.error(err);
        res.json(group);
    })
});

module.exports = router;