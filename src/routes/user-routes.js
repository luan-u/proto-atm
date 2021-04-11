
/*
const UserRouter = require('../controllers/UserController');

module.exports = function(app){
    app.post('/users', UserRouter.post);
    app.put('/user/:id', UserRouter.put);
    app.delete('/user/:id', UserRouter.delete);
    app.get('/users', UserRouter.get);
    app.get('/user/:id', UserRouter.getById);
}

*/

const UserController = require('../controllers/user-controller');

module.exports = function(app){
  app.get('/users', UserController.get);
  app.post('/users', UserController.post);
  app.get('/users/:cpf', UserController.getByCpf);
  app.put('/users/:cpf', UserController.put);
  app.delete('/users/:cpf', UserController.delete);
}
