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
