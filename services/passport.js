const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {keys} = require('../keys/keys');
const {User} = require('../models/models');

passport.serializeUser( (user, done) => {
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
        if(doc) {
          console.log(doc);
          done(null, doc);
        } else {
          var user = new User({
            googleId: profile.id,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            email: profile.emails[0].value
          });
          user.save().then(
            (res) => {console.log('Success'); done(null, res);},
            (err) => console.log('Failure')
          );
        }
      }
    )
  }
));
