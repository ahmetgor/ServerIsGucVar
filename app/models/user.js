var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var UserSchema = new mongoose.Schema({

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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  activateToken: String,
  ozgecmis: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ozgecmis'
  },
  },
    {
      timestamps: { createdAt: 'olusturmaTarih', updatedAt: 'guncellemeTarih' }
  });

UserSchema.pre('save', function(next){

    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            user.password = hash;
            next();

        });
    });
});

UserSchema.pre('update', function(next){

    var user = this;
    var SALT_FACTOR = 5;

    if(!user.isModified('password')){
        return next();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){

        if(err){
            return next(err);
        }

        bcrypt.hash(user.password, salt, null, function(err, hash){

            if(err){
                return next(err);
            }

            user.password = hash;
            next();

        });
    });
});

UserSchema.methods.comparePassword = function(passwordAttempt, cb){
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

module.exports = mongoose.model('User', UserSchema);
