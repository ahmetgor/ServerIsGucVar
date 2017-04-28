var Ozgecmis = require('../models/ozgecmis');

exports.getOzgecmis = function(req, res, next){
      Ozgecmis.findOne({ _id: req.params.ozgecmis_id }, function(err, kayit) {

          if (err){
              res.send(err);
          }
          console.log(JSON.stringify(kayit));
          res.json(kayit);
      });
}

exports.updateOzgecmis = function(req, res, next){
    // console.log(req.body);
    var param_name = req.params.param_name;
    // console.log(param_name+'    '+req.params.ozgecmis_id) ;
    // console.log(param_name+'    '+JSON.stringify(req.body)) ;
    Ozgecmis.update({ _id: req.params.ozgecmis_id }, {yabanciDil : req.body}, function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}

exports.updateOzgecmisAll = function(req, res, next){
    // console.log(req.body);

    Ozgecmis.update({ _id: req.params.ozgecmis_id }, req.body, function(err, kayit) {

      if (err){
          res.send(err);
      }
        res.json(kayit);
    });
}
