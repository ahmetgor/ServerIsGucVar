var jwt = require('jsonwebtoken');
var Firma = require('../models/firma');
var FirmaUser = require('../models/firmauser');
var authConfig = require('../../config/auth');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

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
      firma: request.firmaObj.firma,
      resim: request.resim,
      firmaresim: request.firmaObj.resim,
      firmaId: request.firmaObj._id
  };
}

exports.firmaLogin = function(req, res, next){

    var userInfo = setUserInfo(req.user);
    console.log(JSON.stringify(req.user)+"req user")
    res.status(200).json({
        token: 'JWT ' + generateToken(userInfo),
        user: userInfo
    });
}

exports.firmaRegister = function(req, res, next){

    var email = new RegExp("^"+req.body.email+"$", "i");
    var password = req.body.password;
    var firma = new RegExp("^"+req.body.firma+"$", "i");;
    var firmaPass = req.body.firmaPass;
    // var enabled = true;
    // if(!email){
    //     return res.status(422).send({error: 'Email girmediniz!'});}
    // if(!password){
    //     return res.status(422).send({error: 'Şifre girmediniz!'});}
    // if(!firma){
    //     return res.status(422).send({error: 'Firma girmediniz!'});}
    // if(!firmaPass){
    //     return res.status(422).send({error: 'Firma şifresi girmediniz!'});}
// {email: {'$regex': email, $options:'i'}}
    // User.findOne({email: email}, function(err, existingUser){
    //
    //     if(err){
    //         return next(err);
    //     }
    //
    //     if(existingUser){
    //         console.log('Bu email kullanımda');
    //         return res.status(422).send({error: 'Bu email kullanımda!'});
    //     }

        Firma.findOne({firma: firma}, function(err, existingFirma){

            if(err){
                return next(err);
            }

            if(existingFirma){
                console.log('Bu firma kullanımda kullanımda');
                return res.status(422).send({error: 'Bu firma kullanımda!'});
            }

            FirmaUser.findOne({email: email}, function(err, existingFirma){

                if(err){
                    return next(err);
                }

                if(existingFirma){
                    console.log('Bu email kullanımda kullanımda');
                    return res.status(422).send({error: 'Bu email kullanımda!'});
                }

        console.log("user yaratılıyor")
        var firma = new Firma({
            email: req.body.email,
            password: password,
            firma: req.body.firma,
            // firmaObj: firmaObj,
            enabled: true,
            resim: req.body.userUrl
        });

        var firmauser = new FirmaUser({
            email: req.body.email,
            password: password,
            role: 'Manager',
            enabled: false,
            resim: req.body.firmaUrl
        });

        firma.save(function(err, firma){

            if(err){
                return next(err);
            }

            firmauser.firma = firma._id;
            firmauser.save(function(err, user){

                if(err){
                    return next(err);
                }
                done(err, user);
            });
            res.status(201).json({
              // var userInfo = setUserInfo(user);
            //     // token: 'JWT ' + generateToken(userInfo),
            //     // user: userInfo
            });
        });

      });
      });
}

exports.userRegister = function(req, res, next){

    var email = req.body.email;
    var password = req.body.password;
    // var firma = req.body.firma;
    // var firmaPass = req.body.firmaPass;
    // var enabled = true;
// {email: {'$regex': email, $options:'i'}}
    FirmaUser.findOne({email: new RegExp("^"+req.body.email+"$", "i")}, function(err, existingUser){

        if(err){
            return next(err);
        }

        if(existingUser){
          // console.log('Bu email kullanımda');
            return res.status(422).send({error: 'Bu email kullanımda!'});
        }

        var firmauser = new FirmaUser({
            email: email,
            password: password,
            // firma: firma,
            // firmaObj: firmaObj,
            role: 'Employer',
            enabled: false,
            resim: req.body.resim
        });

        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          firmauser.activateToken = token;

        firmauser.save(function(err, user){

            if(err){
                return next(err);
            }

            var smtpTransport = nodemailer.createTransport( {
              service: 'Gmail',
              auth: {
                user: 'agor.yazilim@gmail.com',
                pass: 'musamba01'
              }
            });
            var mailOptions = {
              to: user.email,
              from: 'agor.yazilim@gmail.com',
              subject: 'İşGüçVar Hesap Aktivasyon',
              text: 'Merhaba,\n\n' +
                'İşgüçvar hesabı oluşturdunuz. Hesabınızın aktiflenmesi için lütfen aşağıdaki linke tıklayın. \n\n' +
                'http://' + req.headers.host + '/tools/activate/' + token + '\n\n' +
                'Görüşmek üzere :) \n'+
                'İşGüçVar Ekibi \n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {

              if (err){
                  res.send(err);
              }
              // res.send('success');

            });
            // var userInfo = setUserInfo(user);
            res.status(201).json({
                // token: 'JWT ' + generateToken(userInfo),
                // user: userInfo
            });
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
