var jwt = require('jsonwebtoken');
var User = require('../models/user');
var Ozgecmis = require('../models/ozgecmis');
var authConfig = require('../../config/auth');

function generateToken(user){
    return jwt.sign(user, authConfig.secret, {
        expiresIn: 10080
    });
}

function setUserInfo(request){
    return {
        _id: request._id,
        email: request.email,
        ozgecmis: request.ozgecmis
    };
}

exports.login = function(req, res, next){

    var userInfo = setUserInfo(req.user);
    console.log(JSON.stringify(userInfo)+"userinfo");

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}

exports.register = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;

    if(!email){
        return res.status(422).send({error: 'Email girmediniz!'});
    }

    if(!password){
        return res.status(422).send({error: 'Şifre girmediniz!'});
    }
// {email: {'$regex': email, $options:'i'}}
    User.findOne({email: email}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
          // console.log('Bu email kullanımda');
            return res.status(422).send({error: 'Bu email kullanımda!'});
        }

        var user = new User({
            email: email,
            password: password,
            enabled: true
        });

        var ozgecmis = new Ozgecmis({
    "isim": email.substring(0, email.indexOf('@')),
    "tecrube" : [
    //   {
    //   "firma" : "",
    //   "pozisyon" : "",
    //   "giris" : "",
    //   "cikis" : "",
    //   "sehir" : "",
    //   "isTanimiKisa" : "",
    //   "detay" : "",
    //   "ulke" : ""
    // }
    ],
    "egitim" : [
    //   {
    //   "okul" : "",
    //   "bolum" : "",
    //   "derece" : "",
    //   "cikis" : "",
    //   "sehir" : "",
    //   "ulke" : ""
    // }
    ],
    "yabanciDil" : [
    //   {
    //   "dil" : "",
    //   "seviye" : ""
    // }
    ],
    "sertifika" : [
    //   {
    //   "ad" : "",
    //   "cikis" : "",
    //   "kurum" : ""
    // }
    ],
    "enabled" : false
});

        ozgecmis.save(function(err,ozgecmis) {
          if(err){
              return next(err);
          }
          user.ozgecmis = ozgecmis._id;

        user.save(function(err, user){

            if(err){
                return next(err);
            }
            // var userInfo = setUserInfo(user);
            res.status(201).json({
                // token: 'JWT ' + generateToken(userInfo),
                // user: userInfo
            })
        });
      });
      });
}

exports.updateUser = function(req, res, next){
    console.log(JSON.stringify(req.body.email)+"updatenormaluser");
    console.log(req.body.newpassword);
    User.findOne({
        email : req.body.email
    }, function(err, kayit) {

      if (err){
          res.send(err);
      }
      if(req.body.newpassword) kayit.password = req.body.newpassword;

      kayit.guncellemeTarih = Date.now();
      kayit.save(function(err) {
        if (err){
            // res.send(err);
          return res.status(422).send({error: err});
        }
        res.status(201).json(kayit);
      });
    });
}
