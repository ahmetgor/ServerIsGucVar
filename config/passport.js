var passport = require('passport');
var User = require('../app/models/user');
var FirmaUser = require('../app/models/firmauser');
var Firma = require('../app/models/firma');
var config = require('./auth');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var LocalStrategy = require('passport-local').Strategy;
var LocalFirmaStrategy = require('passport-local').Strategy;

var localOptions = {
    usernameField: 'email'
    // passReqToCallback: true
};

var localFirmaOptions = {
    usernameField: 'firma',
    passwordField: 'firmaPass'
    // passReqToCallback: true
};

var localLogin = new LocalStrategy(localOptions, function(email, password, done){

  // console.log(JSON.stringify(req.body)+'req');
    User.findOne({
        email: new RegExp('^' + email + "$", 'i'),
        // {'$regex': email, $options:'i'},
        // firma: {'$regex': req.body.firma, $options:'i'},
        enabled: true
        // role: req.body.role
    }, function(err, user){
      console.log("passport user");

        if(err){
          console.log("err")
            return done(err);
        }

        if(!user){
          console.log("!! user");
            return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
        }

        if(user && user.enabled == false){
          console.log("enabled");
            return done(null, false, {error: 'Hesabınız aktif değil'});
        }
        console.log("passport user");

        user.comparePassword(password, function(err, isMatch){

            if(err){
                return done(err);
            }

            if(!isMatch){
              console.log("pass");
                return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
            }

            return done(null, user);
        });
    });
});

var firmaUserLogin = new LocalStrategy(localOptions, function(email, password, done){

  // console.log(JSON.stringify(req.body)+'req');
    FirmaUser.findOne({
        email: new RegExp('^' + email + "$", 'i'),
        // {'$regex': email, $options:'i'},
        // firma: {'$regex': req.body.firma, $options:'i'},
        enabled: true
        // role: req.body.role
    }, function(err, user){
      console.log("passport firmauser");

        if(err){
          console.log("err")
            return done(err);
        }

        if(!user){
          console.log("!! firmauser");
            return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
        }

        if(user && user.enabled == false){
          console.log("enabled");
            return done(null, false, {error: 'Hesabınız aktif değil'});
        }
        console.log("passport firmauser");

        user.comparePassword(password, function(err, isMatch){

            if(err){
                return done(err);
            }

            if(!isMatch){
              console.log("firmauser pass");
                return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
            }

            return done(null, user);
        });
    })
    .populate({ path: 'firmaObj'});
});

var localFirmaLogin = new LocalStrategy(localFirmaOptions, function(firma, password, done){

  // console.log(JSON.stringify(req.body)+'req');
    Firma.findOne({
        firma: new RegExp('^' + firma + "$", 'i'),
        // firma: {'$regex': req.body.firma, $options:'i'},
        enabled: true
        // role: req.body.role
    }, function(err, firma){
      console.log("passport firma");

        if(err){
          console.log("err firma");
            return done(err);
        }

        if(!firma){
          console.log("passport firma hata");

            return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
        }

        if(firma && firma.enabled == false){
          console.log("firma enabled");
            return done(null, false, {error: 'Firma aktif değil'});
        }
        console.log("passport firma1");

        firma.comparePassword(password, function(err, isMatch){

            if(err){
                return done(err);
            }

            if(!isMatch){
              console.log("pass firma false");
                return done(null, false, {error: 'Girdiğiniz bilgilerden en az biri hatalı'});
            }

            return done(null, firma);
        });
    });
});

var jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){

    User.findById(payload._id, function(err, user){

        if(err){
            return done(err, false);
        }

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

var jwtFirmaLogin = new JwtStrategy(jwtOptions, function(payload, done){

    FirmaUser.findById(payload._id, function(err, user){

        if(err){
            return done(err, false);
        }

        if(user){
            done(null, user);
        } else {
            done(null, false);
        }
    })
    .populate({ path: 'firmaObj'
    // , match: { $and : [ firma, { $or: [ {firma: st} ] }]}
});
});

passport.use('jwt-user',jwtLogin);
passport.use('jwt-firmauser',jwtFirmaLogin);
passport.use('user-login', localLogin);
passport.use('firma-login', localFirmaLogin);
passport.use('userfirma-login', firmaUserLogin);
