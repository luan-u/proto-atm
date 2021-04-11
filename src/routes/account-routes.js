const AccountController = require('../controllers/account-controller');

module.exports = function(app){
    app.get('/accounts/cpf/:cpf', AccountController.getByCpf);
    app.get('/accounts/:id', AccountController.getById);
    app.post('/accounts', AccountController.post);
    app.put('/accounts/:id/deposit/:value', AccountController.deposit);
    app.put('/accounts/:id/withdraw/:value', AccountController.withdraw);
}