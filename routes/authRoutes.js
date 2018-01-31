const passport = require('passport');
const moment = require('moment');
const path = require('path');
const jwt = require('jsonwebtoken');
const { User, Record, Subject, TimeTable, StudentReport} = require('../models/models');
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
    } else {
    res.redirect('/client/user/attendance');
    }
  });
  app.get('/', (req, res) => {
    res.send("Its Working");
  });
  app.get('/api/upload', (req, res) => res.sendFile(path.join(__dirname + '/../dist', 'fileupload.html')));
  app.get('/api/admin/getReports', (req,res) => {
    StudentReport.find().then(
      (docs) => res.send(docs),
      (err) => res.send(err) 
    );
  });
  app.get('/api/admin/getRecordData', (req,res) => {
    var decoded;
    try {
      var decoded = jwt.verify(req.headers('x-auth'));
      console.log(decoded);
      if (decoded.email === 'srijanreddy98@gmail.com' || decoded.email === 'acadcom@iimidr.ac.in'){
        Record.findById(req.query.id).then(
          (doc) => res.send(doc),
          (err) => res.send(err)
        );
      }
    }
    catch (e) {
      res.status(401).send(e);
    }
  });
  app.post('/api/admin/login', (req, res) => {
    if ((req.body.email === 'srijanreddy98@gmail.com' || req.body.email === 'acadcom@iimidr.ac.in') && req.body.password === 'password' ){
      var resp = {
        'x-auth': jwt.sign({ email: req.body.email}, 'key'),
      };
      res.send(resp);  
    } else {
      res.status(401).send({error: 'Unauthorized'});
    }
  });
  app.post('/api/report' , (req,res) => {
    StudentReport.findOne({AttendanceId: req.body.id}).then(
      (doc) => {
        if (doc){
          res.status(400).send({error: "Record Already Exists"});
        } else {
          var rep = new StudentReport({ AttendanceId: req.body.id });
          rep.save().then(
            (doc) => res.send(doc),
            (err) => res.status(500).send(err)
          );
        }
      },
      (err) => console.log(err)
    );
  });
  app.get('/api/admin/downloadRecords', (req, res) => {
    res.sendFile(path.join(__dirname + '/../Public/Upload', 'myImage.PNG'));
  });
}
module.exports = {
  routes
}
