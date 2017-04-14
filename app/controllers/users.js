var User = require('../models/user');

exports.getUsers = function(req, res, next){
  // console.log(req.query.firma +'firma' );
    User.find({ firma: req.user.firma }, function(err, kayit) {

        if (err){
            res.send(err);
        }

        res.json(kayit);
    });
  }

  exports.getUser = function(req, res, next){

      User.findOne({ email: req.params.email }, { password: 0 }, function(err, kayit) {

          if (err){
              res.send(err);
          }

          res.json(kayit);
        });
    }

  exports.updateUser = function(req, res, next){
      // console.log(req.body);
      User.update({
          _id : req.params.user_id
      }, req.body, function(err, kayit) {

        if (err){
            res.send(err);
        }
          res.json(kayit);
      });
  }

  exports.deleteUser = function(req, res, next){

      User.remove({
          _id : req.params.user_id
      }, function(err, kayit) {

        if (err){
            res.send(err);
        }
          res.json(kayit);
      });
    }
