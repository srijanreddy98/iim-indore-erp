const passport = require('passport');
const {User, Record} = require('../models/models');
var routes = (app) => {
  app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
  })
  );
  app.get(
    '/auth/google/callback',
     passport.authenticate('google'),
    (req, res) => {
      // console.log(req);
      res.redirect('/api/current_user');
    }
  );
  app.get(
    '/api/records',
    (req, res) => {
      console.log(req.headers.body);
      Record.find({Roll_No: req.headers.body}).then(
        (docs) => {console.log(docs);res.send(docs);},
        (err) => console.log(err)
      );
    }
  );
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send('Logged Out');
  })
  app.get('/api/current_user', (req, res) => {
    // if (req.query.client){
    //   res.send(req.user);
    // }
    // res.redirect('http://iim-indore-erp.s3-website.ap-south-1.amazonaws.com/user/attendance');
    res.send(req.user);
  });
  app.get('/', (req, res) => {
    res.send("Its Working");
  });
}
module.exports = {
  routes
}
