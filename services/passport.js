const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {keys} = require('../keys/keys');
const {User} = require('../models/models');

passport.serializeUser( (user, done) => {
  // console.log(user);
  done(null, user.id);
});
passport.deserializeUser((id,done) => {
  User.findById(id).then((user) => {
    done(null, user);
  })
})
passport.use(
  new GoogleStrategy(
  {
    clientID: keys.clientID,
    clientSecret: keys.client_secret,
    callbackURL: '/auth/google/callback',
    proxy: true
  },
  (accessToken,refreshToken, profile, done) => {
    User.findOne({googleId: profile.id}).then(
      (doc) => {
        if (doc && doc.email === profile.emails[0].value) {
          done(null, doc);
        } else {
          User.findOne({ email: profile.emails[0].value }).then(
            (docu) => {
              if (docu){
                User.findOneAndUpdate({ email: profile.emails[0].value }, { $set: { googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,}},{new: true}, (err , res) => {
                  // console.log(res);
                  if(err) {
                    console.log('Error');
                  } else {
                    console.log('Success');

                    done(null, res);
                  }
                });
              } else {
                done(null, null);
              }
            }
          )

        }
      }
    )
  }
));
