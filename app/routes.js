var AuthenticationController = require('./controllers/authentication'),
    TodoController = require('./controllers/ilanlar'),
    AktiviteController = require('./controllers/aktiviteler'),
    UsersController = require('./controllers/users'),
    OzgecmisController = require('./controllers/ozgecmisler'),
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
        aktiviteRoutes = express.Router();
        ozgecmisRoutes = express.Router();
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

    apiRoutes.use('/ozgecmis', ozgecmisRoutes);
    // aktiviteRoutes.get('/ozgecmis', AktiviteController.getBasvurular);
    ozgecmisRoutes.put('/:ozgecmis_id/:param_name', OzgecmisController.updateOzgecmis);
    ozgecmisRoutes.put('/:ozgecmis_id', OzgecmisController.updateOzgecmisAll);
    ozgecmisRoutes.get('/:ozgecmis_id', OzgecmisController.getOzgecmis);
    // ozgecmisRoutes.post('/', OzgecmisController.createBasvuru);
    // ozgecmisRoutes.delete('/', OzgecmisController.deleteBasvuru);

    apiRoutes.use('/aktiviteler', aktiviteRoutes);

    aktiviteRoutes.get('/basvuru', AktiviteController.getBasvurular);
    aktiviteRoutes.get('/basvuru/:basvuru_id', AktiviteController.getBasvuru);
    aktiviteRoutes.post('/basvuru', AktiviteController.createBasvuru);
    aktiviteRoutes.delete('/basvuru', AktiviteController.deleteBasvuru);

    // aktiviteRoutes.get('/kaydedilen', AktiviteController.getKaydedilenler);
    aktiviteRoutes.get('/kaydedilen', AktiviteController.getKaydedilenler);
    aktiviteRoutes.get('/kaydedilen/:kaydedilen_id', AktiviteController.getKaydedilen);
    aktiviteRoutes.post('/kaydedilen', AktiviteController.createKaydedilen);
    aktiviteRoutes.delete('/kaydedilen', AktiviteController.deleteKaydedilen);

    aktiviteRoutes.get('/basvurulist', AktiviteController.getBasvurularList);
    aktiviteRoutes.get('/kaydedilenlist', AktiviteController.getKaydedilenlerList);

    // Set up routes
    app.use('/api', apiRoutes);

}
