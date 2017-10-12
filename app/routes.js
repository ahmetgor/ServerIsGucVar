var AuthenticationController = require('./controllers/authentication'),
    FirmaController = require('./controllers/firmaAuth'),
    TodoController = require('./controllers/ilanlar'),
    AktiviteController = require('./controllers/aktiviteler'),
    UsersController = require('./controllers/users'),
    OzgecmisController = require('./controllers/ozgecmisler'),
    HashController = require('./controllers/hash'),
    AvatarController = require('./controllers/cloudinary'),

    express = require('express'),
    passportService = require('../config/passport'),
    passport = require('passport');

var requireAuth = passport.authenticate('jwt-user', {session: false}),
    requireLogin = passport.authenticate('user-login', {session: false}),
    requireFirmaLogin = passport.authenticate('firma-login', {session:false});
    requireUserFirmaLogin = passport.authenticate('userfirma-login', {session:false});
    requireUserFirmaAuth = passport.authenticate('jwt-firmauser', {session:false});


module.exports = function(app){

    var apiRoutes = express.Router(),
        authRoutes = express.Router(),
        todoRoutes = express.Router();
        userRoutes = express.Router();
        aktiviteRoutes = express.Router();
        ozgecmisRoutes = express.Router();
        firmaRoutes = express.Router();

    // Auth Routes
    apiRoutes.use('/auth', authRoutes);

    authRoutes.post('/register', AuthenticationController.register);
    authRoutes.post('/login', requireLogin, AuthenticationController.login);
    // authRoutes.get('/users', requireAuth, AuthenticationController.users);
    authRoutes.post('/updatenormaluser', requireAuth, AuthenticationController.updateUser);
    authRoutes.get('/protected', requireAuth, function(req, res){
        res.send({ content: 'Success'});
    });

    apiRoutes.use('/firmaauth', firmaRoutes);
    firmaRoutes.post('/register/firma', FirmaController.firmaRegister);
    firmaRoutes.post('/register/user', requireFirmaLogin, FirmaController.userRegister);
    firmaRoutes.post('/login', requireUserFirmaLogin,  FirmaController.firmaLogin);
    firmaRoutes.put('/updateuser', requireUserFirmaAuth,  FirmaController.updateUser);
    firmaRoutes.put('/updateuseren', requireUserFirmaAuth,  FirmaController.updateUser);
    firmaRoutes.put('/updatefirma', requireUserFirmaAuth,  FirmaController.updateFirma);
    // authRoutes.get('/users', requireAuth, AuthenticationController.users);
    firmaRoutes.get('/protected', requireUserFirmaAuth, function(req, res){
        res.send({ content: 'Success'});
    });
    // app.get('/loginfail', function(req, res){
    //     return res.status(422).send({error: 'Firma bilgileri hatalı!'});
    // });

    // apiRoutes.get('/hash', Hash Controller.getHash );
    // apiRoutes.post('/tools/avatar', AvatarController.postAvatar);
    apiRoutes.post('/tools/forgot', AvatarController.postForgot);
    apiRoutes.post('/tools/reset', AvatarController.resetPass);
    apiRoutes.get('/tools/activate/:token', AvatarController.actUser);
    // apiRoutes.post('/tools/firma', AvatarController.actFirma);



    // apiRoutes.use('/users', userRoutes);
    //
    // userRoutes.get('/', requireAuth, UsersController.getUsers);
    // userRoutes.get('/:email', requireAuth, UsersController.getUser);
    // userRoutes.delete('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['creator']), UsersController.deleteUser);
    // userRoutes.put('/:user_id', requireAuth, AuthenticationController.roleAuthorization(['creator']), UsersController.updateUser);

    // Todo Routes
    apiRoutes.use('/ilanlar', todoRoutes);
    todoRoutes.get('/', TodoController.getIlanlar);
    todoRoutes.get('/:kayit_id', TodoController.getIlan);
    todoRoutes.put('/:ilan_id', TodoController.updateIlan);
    todoRoutes.get('/getusers/:firma_id', TodoController.getUsers);
    todoRoutes.post('/', TodoController.createIlan);

    // todoRoutes.post('/', requireAuth, /* AuthenticationController.roleAuthorization(['creator', 'editor', 'reader']), */ TodoController.createKayit);
    // todoRoutes.delete('/:kayit_id', requireAuth,TodoController.deleteKayit);
    // todoRoutes.put('/:kayit_id', requireAuth TodoController.updateKayit);

    apiRoutes.use('/ozgecmis', ozgecmisRoutes);
    // aktiviteRoutes.get('/ozgecmis', AktiviteController.getBasvurular);
    ozgecmisRoutes.put('/:ozgecmis_id/:param_name', requireAuth, OzgecmisController.updateOzgecmis);
    ozgecmisRoutes.put('/:ozgecmis_id', requireAuth, OzgecmisController.updateOzgecmisAll);
    ozgecmisRoutes.get('/:ozgecmis_id', requireAuth, OzgecmisController.getOzgecmis);
    ozgecmisRoutes.get('/firma/:ozgecmis_id', OzgecmisController.getOzgecmis);

    ozgecmisRoutes.get('/', OzgecmisController.getOzgecmisler);
    ozgecmisRoutes.post('/begen/:ozgecmis_id/', OzgecmisController.begenOzgecmis);
    ozgecmisRoutes.post('/begenme/:ozgecmis_id/', OzgecmisController.begenmeOzgecmis);

    // ozgecmisRoutes.get('/avatar', requireAuth, OzgecmisController.getAvatar);
    // ozgecmisRoutes.post('/', OzgecmisController.createBasvuru);
    // ozgecmisRoutes.delete('/', OzgecmisController.deleteBasvuru);

    apiRoutes.use('/aktiviteler', aktiviteRoutes);

    aktiviteRoutes.get('/basvuru', requireAuth, AktiviteController.getBasvurular);
    aktiviteRoutes.get('/basvuru/:basvuru_id', requireAuth, AktiviteController.getBasvuru);
    aktiviteRoutes.post('/basvuru', requireAuth, AktiviteController.createBasvuru);
    aktiviteRoutes.delete('/basvuru', requireAuth, AktiviteController.deleteBasvuru);

    // aktiviteRoutes.get('/kaydedilen', AktiviteController.getKaydedilenler);
    aktiviteRoutes.get('/kaydedilen', requireAuth, AktiviteController.getKaydedilenler);
    aktiviteRoutes.get('/kaydedilen/:kaydedilen_id', requireAuth, AktiviteController.getKaydedilen);
    aktiviteRoutes.post('/kaydedilen', requireAuth, AktiviteController.createKaydedilen);
    aktiviteRoutes.delete('/kaydedilen', requireAuth, AktiviteController.deleteKaydedilen);

    aktiviteRoutes.get('/basvurulist', requireAuth, AktiviteController.getBasvurularList);
    aktiviteRoutes.get('/kaydedilenlist', requireAuth, AktiviteController.getKaydedilenlerList);

    // Set up routes
    app.use('/api', apiRoutes);

}
