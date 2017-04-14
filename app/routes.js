var AuthenticationController = require('./controllers/authentication'),
    TodoController = require('./controllers/ilanlar'),
    UsersController = require('./controllers/users'),
    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt', {session: false}),
    requireLogin = passport.authenticate('local', {session: false});

module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();
        userRoutes = express.Router();

        // app.post('/login', function(req, res, next ){
        //     passport.authenticate('local', function(err, user, info) {
        //       if (err) { return next(err) }
        //       if (!user) { return res.json( { message: info.message }) }
        //       res.json(user);
        //     })(req, res, next);
        // });

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    // authRoutes.get('/users', requireAuth, AuthenticationController.users);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });


    apiRoutes.use('/users', userRoutes);

    userRoutes.get('/', requireAuth, UsersController.getUsers);
    userRoutes.get('/:email', requireAuth, UsersController.getUser);
    userRoutes.delete('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['creator']), UsersController.deleteUser);
    userRoutes.put('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['creator']), UsersController.updateUser);


    // Todo Routes
    apiRoutes.use('/ilanlar', todoRoutes);

    todoRoutes.get('/', TodoController.getIlanlar);
    todoRoutes.get('/:kayit_id', TodoController.getIlan);
    // todoRoutes.post('/', requireAuth, /* AuthenticationController.roleAuthorization(['creator', 'editor', 'reader']), */ TodoController.createKayit);
    // todoRoutes.delete('/:kayit_id', requireAuth,TodoController.deleteKayit);
    // todoRoutes.put('/:kayit_id', requireAuth TodoController.updateKayit);

    // Set up routes
    app.use('/api', apiRoutes);

}
