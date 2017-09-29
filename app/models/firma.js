var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Counter = require('../models/counter');

var FirmaSchema = new mongoose.Schema({
  id: {
      type: Number
      //required: true
  },
    email: {
        type: String,
        // lowercase: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    resim: {
        type: String
    },
    enabled: {
        type: Boolean
      },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activateToken: String,
  firma: {
    type: String,
    unique: true
    },
  },
  {
      timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
      collection: 'firma'
    });

FirmaSchema.pre('save', function(next){

    var firma = this;
    var SALT_FACTOR = 5;

    if(!firma.isModified('password')) {
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(firma.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            firma.password = hash;
            Counter.findOneAndUpdate({id: 'firmaid'},
                {$inc: { seq: 1} }, function(error, counter)   {
                if(error)
                return next(error);
                console.log("firma"+counter.seq)
                firma.id = counter.seq;
                next();

              });
        });
    });

  // if(firma.isModified('firmaPass')) {
  //     bcrypt.genSalt(SALT_FACTOR, function(err, salt){
  //
  //         if(err){
  //             return next(err);
  //         }
  //
  //         bcrypt.hash(firma.firmaPass, salt, null, function(err, hash){
  //
  //             if(err){
  //                 return next(err);
  //             }
  //
  //             firma.password = hash;
  //             next();
  //         });
  //     });
  //   }
});

FirmaSchema.pre('update', function(next){

    var firma = this;
    var SALT_FACTOR = 5;

    if(!firma.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(firma.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            firma.password = hash;
            next();
        });
    });

  // if(firma.isModified('firmaPass')) {
  //     bcrypt.genSalt(SALT_FACTOR, function(err, salt){
  //
  //         if(err){
  //             return next(err);
  //         }
  //
  //         bcrypt.hash(firma.firmaPass, salt, null, function(err, hash){
  //
  //             if(err){
  //                 return next(err);
  //             }
  //
  //             firma.password = hash;
  //             next();
  //         });
  //     });
  //   }
});

FirmaSchema.methods.comparePassword = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

FirmaSchema.methods.compareFirmaPass = function(passwordAttempt, cb){

    bcrypt.compare(passwordAttempt, this.firmaPass, function(err, isMatch){

        if(err){
            return cb(err);
        } else {
            cb(null, isMatch);
        }
    });
}

module.exports = mongoose.model('Firma', FirmaSchema);
