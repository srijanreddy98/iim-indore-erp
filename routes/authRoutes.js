const passport = require('passport');
const moment = require('moment');
const {User, Record, Subject, TimeTable} = require('../models/models');
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
      // console.log(req.headers.body);
      Record.find({Roll_No: req.headers.body}).then(
        (docs) => {res.send(docs);},
        (err) => console.log(err)
      );
    }
  );
  app.get(
    '/api/timetable',
    (req, res) => {
      console.log(req.query.date);
      TimeTable.
        find({ Subject: req.query.sub }).sort({ 'Session_No': 1 }).then(
          (docs) => res.send(docs),
          (err) => res.send(err)
        );
    }
  );
  app.get(
    '/api/subjects',
    (req, res) => {
      Subject.
      find({ Roll_No: req.query.roll}).select({ Subject: 1 }).then(
        (docs) => res.send(docs),
        (err) => res.send(err)
      );
    }
  );
  app.get('/api/logout', (req, res) => {
    req.logout();
    res.send('Logged Out');
  });
  app.get('/api/current_user', (req, res) => {
    if (req.query.client){
      res.send(req.user);
    }
    res.redirect('/client/user');
  });
  app.get('/', (req, res) => {
    res.send("Its Working");
  });
}
module.exports = {
  routes
}
