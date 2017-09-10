var cloudinary = require('cloudinary');
var async = require('async');
var User = require('../models/user');
var FirmaUser = require('../models/firmauser');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: 'isgucvar',
  api_key: '139222621445761',
  api_secret: 'MgNsTRvxidEy0HaIARj4Ip7Txq0'
});

exports.postAvatar = function(req, res, next){
  // console.log(JSON.stringify(req.body.resim)+'body');
  console.log(JSON.stringify(req.body.resim)+'body');
cloudinary.v2.uploader.upload(req.body.resim, {timeout:120000}, function(err,result) {
  console.log(JSON.stringify(result)+'result');
  console.log(JSON.stringify(err)+'err');

  res.json(result);
});
}

exports.actUser = function(req, res, next){
  FirmaUser.findOne({activateToken: req.params.token},
  function(err, user) {
    if (!user) {
      return res.status(422).send({error: 'Aktivasyon no bulunamadı.'});
    }

    user.activateToken = undefined;
    user.enabled = true;

    user.save(function(err) {
      if (err){
          // res.send(err);
      return next(err);
      }
      res.send("Aktivasyon başarılı");
    });
  });
}

exports.postForgot = function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return res.status(422).send({error: 'Email bulunamadı'});

        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {
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
        subject: 'İşGüçVar Şifre Reset',
        text: 'Merhaba,\n\n' +
          'Bu mail şifrenizin resetlenmesi isteğine istinaden atılmıştır.\n\n' +
          'Eğer böyle ise aşağıdaki geçici şifreyi kullanarak şifrenizi değiştirebilirsiniz.\n\n' +
          token + '\n\n' +
          'Eğer bu istek sizin tarafınızdan yapılmadıysa lütfen bu maili yoksayın. Şifreniz aynı kalacaktır. \n\n' +
          'Görüşmek üzere :) \n'+
          'İşGüçVar Ekibi \n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {

        if (err){
            res.send(err);
        }
        res.send('success');

      });
    }
  ], function(err) {
    if (err) return next(err);
  });
}

exports.resetPass = function(req, res, next) {
  async.waterfall([
    function(done) {
      User.findOne({email: req.body.email, resetPasswordToken: req.body.resetPasswordToken, resetPasswordExpires: { $gt: Date.now() }},
      function(err, user) {
        if (!user) {
          return res.status(422).send({error: 'Email veya geçici şifre hatalı, belki de geçici şifrenin süresi doldu, tekrar resetlemeyi deneyin'});
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          if (err){
              res.send(err);
          }
          done(err, user);
        });
      });
    },
    function(user, done) {
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
        subject: 'İşGüçVar şifreniz değişti',
        text: 'Merhaba,\n\n' +
          user.email + ' hesabı için şifreniz değişti.\n\n' +
          'Görüşmek üzere :) \n'+
          'İşGüçVar Ekibi \n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        if (err){
          return res.status(422).send({error: 'Reset Emaili gönderilemedi'});
        }
        res.send('success');

      });
    }
  ], function(err) {
    if (err){
        res.send(err);
      }
      });
    }
