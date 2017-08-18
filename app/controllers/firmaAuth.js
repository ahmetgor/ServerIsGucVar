var jwt = require('jsonwebtoken');
var Firma = require('../models/firma');
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
        // role: request.role,
        firma: request.firma
        // firmaObj: request.firmaObj
    };
}

exports.firmaLogin = function(req, res, next){

    var userInfo = setUserInfo(req.user);

    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}

exports.firmaRegister = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;
    var firma = req.body.firma;
    var firmaPass = req.body.firmaPass;
    // var enabled = true;

    if(!email){
        return res.status(422).send({error: 'Email girmediniz!'});
    }
    if(!password){
        return res.status(422).send({error: 'Şifre girmediniz!'});
    }
    if(!firma){
        return res.status(422).send({error: 'Firma girmediniz!'});
    }
    if(!firmaPass){
        return res.status(422).send({error: 'Firma şifresi girmediniz!'});
    }
// {email: {'$regex': email, $options:'i'}}
    Firma.findOne({email: email}, function(err, existingUser){

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
            firma: firma,
            firmaObj: firmaObj,
            enabled: true
        });

        firma.save(function(err, user){

            if(err){
                return next(err);
            }
            // var userInfo = setUserInfo(user);
            res.status(201).json({
                // token: 'JWT ' + generateToken(userInfo),
                // user: userInfo
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
