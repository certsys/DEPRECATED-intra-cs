exports.isDebug = function () {
    var DEBUG = false; // true -> Rotas do Backend não precisam de autenticação
    return DEBUG;
};