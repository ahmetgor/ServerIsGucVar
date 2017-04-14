var jwt = require('jsonwebtoken');
var User = require('../models/user');
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
        role: request.role,
        firma: request.firma

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
    var role = req.body.role;
    var firma = req.body.firma;
    var enabled = false;

    if (role == 'creator') {
      enabled = true;
    }

    if(!email){
        return res.status(422).send({error: 'Email girmediniz!'});
    }

    if(!password){
        return res.status(422).send({error: 'Şifre girmediniz!'});
    }

    User.findOne({email: {'$regex': email, $options:'i'}}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
          // console.log('Bu email kullanımda');
            return res.status(422).send({error: 'Bu email kullanımda!'});
        }

        User.findOne({firma: {'$regex': firma, $options:'i'}, role: 'creator'}, function(err, existingCreator){

          if(err){
              return next(err);
          }

          if(existingCreator && role=='creator'){
            // console.log('Firmada yönetici mevcut');
              return res.status(422).send({error: 'Firmada yönetici mevcut, lütfen başka rol seçiniz!'});
          }
          else if (!existingCreator && role!='creator') {
            return res.status(422).send({error: 'Yeni firmanın yöneticisi olmalı, lütfen yönetici rol seçiniz!'});
          }

        var user = new User({
            email: email,
            password: password,
            role: role,
            firma: firma,
            enabled: enabled
        });

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

exports.roleAuthorization = function(roles){

    return function(req, res, next){

        var user = req.user;

        User.findById(user._id, function(err, foundUser){

            if(err){
                res.status(422).json({error: 'No user found.'});
                return next(err);
            }

            if(roles.indexOf(foundUser.role) > -1 && foundUser.enabled){
              // console.log('founduser '+foundUser.enabled);
                return next();
            }

            res.status(401).json({error: 'You are not authorized to view this content'});
            return next('Not authorized');

        });

    }
}
