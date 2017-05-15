var bcrypt   = require('bcrypt-nodejs');

exports.getHash = function(req, res, next){

bcrypt.genSalt(5, function(err, salt){

    if(err){
        return res.send(err);
    }

    bcrypt.hash(req.password, salt, null, function(err, hash){

        if(err){
            return res.send(err);
        }

        var pass = hash;
        console.log(pass);  
        res.send(pass);

    });

});
}
