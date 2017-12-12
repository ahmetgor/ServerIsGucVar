var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
var Counter = require('../models/counter');

var FirmaUserSchema = new mongoose.Schema({
  id: {
      type: Number
      //required: true
  },
    email: {
        type: String,
        // lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean
      },
      resim: {
        type: String
        ////required: true
      },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activateToken: String,
  activateExpires: Date,
  firmaObj: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Firma'
  },
  firma: {
    type: String
    },
  role: {
    type: String,
    enum: ['Manager', 'Employer']
    },
  },
    {
      timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' } ,
      collection: 'firmauser'
    });

    FirmaUserSchema.pre('save', function(next){

        var firmauser = this;
        var SALT_FACTOR = 5;

        if(!firmauser.isModified('password')){
            return next();
        }

        bcrypt.genSalt(SALT_FACTOR, function(err, salt){

            if(err){
                return next(err);
            }

            bcrypt.hash(firmauser.password, salt, null, function(err, hash){

                if(err){
                    return next(err);
                }
                firmauser.password = hash;

            Counter.findOneAndUpdate({id: 'firmauserid'},
                {$inc: { seq: 1} }, function(error, counter)   {
                if(error)
                return next(error);
                console.log("firmauser"+counter.seq)
                firmauser.id = counter.seq;
                next();

              });
            });
        });
    });

    FirmaUserSchema.pre('update', function(next){

        var firmauser = this;
        console.log(firmauser.email + "firmauser");
        var SALT_FACTOR = 5;

        if(!firmauser.isModified('password')){
            return next();
        }

        bcrypt.genSalt(SALT_FACTOR, function(err, salt){

            if(err){
                return next(err);
            }

            bcrypt.hash(firmauser.password, salt, null, function(err, hash){

                if(err){
                    return next(err);
                }

                firmauser.password = hash;
                next();

            });
        });
    });

    FirmaUserSchema.methods.comparePassword = function(passwordAttempt, cb){
      bcrypt.genSalt(5, function(err, salt){

          if(err){
              return next(err);
          }
          console.log(this.password+'    qweqweqweqwe     '+passwordAttempt);

          bcrypt.hash(passwordAttempt, salt, null, function(err, hash){

              if(err){
                  return next(err);
              }
              console.log(hash+'    asdasdasdasdasdasd');
          });
      });

        bcrypt.compare(passwordAttempt, this.password, function(err, isMatch){

            if(err){
                return cb(err);
            } else {
                cb(null, isMatch);
            }
        });
    }

    module.exports = mongoose.model('FirmaUser', FirmaUserSchema);
