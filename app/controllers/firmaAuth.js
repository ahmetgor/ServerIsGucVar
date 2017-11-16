var jwt = require('jsonwebtoken');
var Firma = require('../models/firma');
var FirmaUser = require('../models/firmauser');
var authConfig = require('../../config/auth');
var crypto = require('crypto');
var nodemailer = require('nodemailer');
var cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'isgucvar',
  api_key: '139222621445761',
  api_secret: 'MgNsTRvxidEy0HaIARj4Ip7Txq0'
});

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

        console.log("firma yaratılıyor")
        var firma = new Firma({
            email: req.body.email,
            password: password,
            firma: req.body.firma,
            telefon: req.body.telefon,
            // firmaObj: firmaObj,
            enabled: true
            // resim: req.body.userUrl
        });

        var firmauser = new FirmaUser({
            email: req.body.email,
            password: password,
            role: 'Manager',
            enabled: true
            // resim: req.body.firmaUrl
        });

        cloudinary.v2.uploader.upload(req.body.userUrl, {timeout:120000}, function(err,result) {
          console.log(JSON.stringify(result)+'result');
          console.log(JSON.stringify(err)+'err');
          if (err){
            return res.status(422).send({error: 'cloudinary'});
          }
          firma.resim = result.secure_url;

        firma.save(function(err, firma){

            if(err){
                return next(err);
            }

            cloudinary.v2.uploader.upload(req.body.firmaUrl, {timeout:120000}, function(err,result) {
              console.log(JSON.stringify(result)+'result');
              console.log(JSON.stringify(err)+'err');
              if (err){
                return res.status(422).send({error: 'cloudinary'});
              }
              firmauser.resim = result.secure_url;

            firmauser.firmaObj = firma._id;
            firmauser.save(function(err, user){

                if(err){
                return  res.send(err);
                }
            });
            res.status(201).json({
              // var userInfo = setUserInfo(user);
            //     // token: 'JWT ' + generateToken(userInfo),
            //     // user: userInfo
            });
        });
      }); //cloudinary 2
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
    Firma.findOne({firma: new RegExp("^"+req.body.firma+"$", "i")}, function(err, existingFirma){
      if(err){
          return next(err);
      }
      var firmaId = existingFirma._id;
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
            firmaObj: firmaId,
            role: 'Employer',
            enabled: false
        });

        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          firmauser.activateToken = token;

          cloudinary.v2.uploader.upload(req.body.resim, {timeout:120000}, function(err,result) {
            console.log(JSON.stringify(result)+'result');
            console.log(JSON.stringify(err)+'err');
            if (err){
              return res.status(422).send({error: 'cloudinary'});
            }
            firmauser.resim = result.secure_url;

        firmauser.save(function(err, user){

            if(err){
            return  res.send(err);
            }

            var smtpTransport = nodemailer.createTransport( {
              service: 'Gmail',
              auth: {
                user: 'agor.yazilim@gmail.com',
                pass: 'Musamba-01'
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
                return  res.send(err);
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

      });
    });
}

exports.updateUser = function(req, res, next){
    console.log(req.body);
    console.log(req.body.email+"email");
    console.log(req.body.newpassword+"pass*");
    // var resim = req.body.newresim ? {resim: req.body.newresim} : {}
    // var pass = req.body.newpassword ? {password: req.body.newpassword} : {}
    // FirmaUser.update({
    //     email : new RegExp(req.body.email, "i")
    // }, { $set: {email:"hebe"}}
    // , function(err, kayit) {
    //
    //   if (err){
    //       res.send(err);
    //   }
    //     res.json(kayit);
    // });
    FirmaUser.findOne(
      {email: new RegExp(req.body.email, "i")},
    function(err, user) {
      if (!user) {
        return res.status(422).send({error: 'Kullanıcı bulunamadı'});
      }

      if (req.body.newpassword) user.password = req.body.newpassword;
      user.resim = req.body.userUrl ? req.body.userUrl : user.resim;
      user.enabled = (req.body.enabled!=undefined) ? req.body.enabled : user.enabled;

      if(req.body.userUrl != undefined && user.resim != req.body.userUrl) {
      cloudinary.v2.uploader.upload(req.body.userUrl, {timeout:120000}, function(err,result) {
        console.log(JSON.stringify(result)+'result');
        console.log(JSON.stringify(err)+'err');
        if (err){
          return res.status(422).send({error: 'cloudinary'});
        }
        user.resim = result.secure_url;
        user.save(function(err) {
          if (err){
            return  res.send(err);
          }
          res.status(201).json({});
        });
      });
    }
      else {
        user.save(function(err) {
          if (err){
              // res.send(err);
            return res.status(422).send({error: err});
          }
          res.status(201).json({});
        });
      }
    });
}

exports.updateFirma = function(req, res, next){
    // console.log(req.body);
    console.log(req.body.email+"email");
    console.log(req.body.newpassword+"pass*");
    Firma.findOne(
      {email: new RegExp(req.body.email, "i")},
    function(err, firma) {
      if (!firma) {
        return res.status(422).send({error: 'Firma bulunamadı'});
      }

      if (req.body.newpassword) firma.password = req.body.newpassword;
      // firma.resim = req.body.userUrl;
      firma.firma = req.body.firma;

      if(firma.resim != req.body.userUrl) {
      cloudinary.v2.uploader.upload(req.body.userUrl, {timeout:120000}, function(err,result) {
        console.log(JSON.stringify(result)+'result');
        console.log(JSON.stringify(err)+'err');
        if (err){
          return res.status(422).send({err: 'cloudinary'});
        }
        firma.resim = result.secure_url;

      firma.save(function(err) {
        if (err){
            // res.send(err);
          return res.status(422).send({error: err});
        }
        res.status(201).json({});
      });
    });
  }
  else {
    firma.save(function(err) {
      if (err){
          // res.send(err);
        return res.status(422).send({error: err});
      }
      res.status(201).json({});
    });
  }
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
