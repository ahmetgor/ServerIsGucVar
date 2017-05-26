var cloudinary = require('cloudinary');
var async = require('async');
var User = require('../models/user');
var crypto = require('crypto');
var nodemailer = require('nodemailer');

cloudinary.config({
  cloud_name: 'isgucvar',
  api_key: '139222621445761',
  api_secret: 'MgNsTRvxidEy0HaIARj4Ip7Txq0'
});

exports.postAvatar = function(req, res, next){
  // console.log(JSON.stringify(req.body.resim)+'body');
  // console.log(JSON.stringify(req.body.resim)+'body');
cloudinary.v2.uploader.upload(req.body.resim, {timeout:120000}, function(err,result) {
  console.log(JSON.stringify(result)+'result');
  console.log(JSON.stringify(err)+'err');

  res.json(result);
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
        subject: 'IsGucVar Şifre Reset',
        text: 'Merhaba,\n\n' +
          'Bu mail şifrenizin resetlenmesi isteğine istinaden atılmıştır.\n\n' +
          'Eğer böyle ise aşağıdaki linke tıklayın veya linki kopyalayıp tarayıcınıza yapıştırın.\n\n' +
          'http://' + req.headers.host + '/tools/reset/' + token + '\n\n' +
          'Eğer bu istek sizin tarafınızdan yapılmadıysa lütfen bu maili yoksayın. Şifreniz aynı kalacaktır. \n\n' +
          'Görüşmek üzere :) \n'+
          'IsGucVar Ekibi \n'
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

exports.resetPass = function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      return res.status(422).send({error: 'Reset linki geçersiz veya süresi doldu.'});

    }
    res.json(user);
  });
}
