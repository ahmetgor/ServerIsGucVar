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
        // role: request.role,
        // firma: request.firma
    };
}

exports.login = function(req, res, next){

    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });

}

exports.register = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;
    var enabled = true;

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
            enabled: enabled
        });

        var ozgecmis = new Ozgecmis({
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
    "resim" : {
      "link" : "",
      "media" : "",
      "profile" : ""
    },
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

// exports.roleAuthorization = function(roles){
//
//     return function(req, res, next){
//
//         var user = req.user;
//
//         User.findById(user._id, function(err, foundUser){
//
//             if(err){
//                 res.status(422).json({error: 'No user found.'});
//                 return next(err);
//             }
//
//             if(roles.indexOf(foundUser.role) > -1 && foundUser.enabled){
//               // console.log('founduser '+foundUser.enabled);
//                 return next();
//             }
//
//             res.status(401).json({error: 'You are not authorized to view this content'});
//             return next('Not authorized');
//         });
//     }
// }
