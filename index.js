const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const {keys} = require('./keys/keys');
require('./services/passport');
const {routes} = require('./routes/authRoutes');
const { User, Record, Subject, TimeTable, StudentReport } = require('./models/models');
const { updateUsers, updateRecords, updateTimeTable, updateSubjects } = require('./Public/Upload/updateDatabase');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const jwt = require('jsonwebtoken');
var bodyParser = require('body-parser');
var XLSX = require('xlsx');
const fs = require('fs');
const json2xls = require('json2xls');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://srijanreddy98:chintu98@ds161336.mlab.com:61336/iimindoredb');
const app = express();

const storage = multer.diskStorage(
  {
    destination: './Public/Upload/',
    filename: (req, file, cb) => {
      cb(null, file.fieldname + path.extname(file.originalname));
    }
  }
);

const uploadUsers = multer({
  storage: storage
}).single('users');
const uploadRecords = multer({
  storage: storage
}).single('records');
const uploadSubjects = multer({
  storage: storage
}).single('subjects');
const uploadTimetable = multer({
  storage: storage
}).single('timetable');
const uploadSubjectNames = multer({
  storage: storage
}).single('subjectNames');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname+'/dist'));
// app.use(express.static('dist'));
app.use(
  cookieSession({
    maxAge: 30 * 24 * 3600 * 1000,
    keys: [keys.cookieKey]
  })
);
app.get('/client/*', function (req, res) {
res.sendFile(path.join(__dirname+'/dist','index.html'));
});
// catch 404 and forward to error handler
// app.use(function(req, res, next) {
// var err = new Error('Not Found It');
// err.status = 404;
// next(err);
// });
app.post('/api/upload/users', (req, res) => {
  uploadUsers(req, res, (err) => {
    if(!err){
      console.log(req.file);
      updateUsers();
      res.send('success');
    }
  })
});
app.post('/api/upload/subjects', (req, res) => {
  uploadSubjects(req, res, (err) => {
    if (!err) {
      console.log(req.file);
      updateSubjects();
      res.send('success');
    }
  })
});
app.post('/api/upload/timetable', (req, res) => {
  uploadTimetable(req, res, (err) => {
    if (!err) {
      console.log(req.file);
      var re = updateTimeTable();
      if (re){;
        res.send(`Error, couldn't process ${re}`);
    } else {
        res.send('success');
    }
  }
  })
});
app.post('/api/upload/records', (req, res) => {
  uploadRecords(req, res, (err) => {
    if (!err) {
      console.log(req.file);
      updateRecords();
      res.send('success');
    }
  })
});
app.post('/api/upload/subjectNames', (req, res) => {
  uploadSubjectNames(req, res, (err) => {
    if (!err) {
      console.log(req.file);
      res.send('success');
    }
  })
});
app.get('/api/upload/records', (req, res) => {
  res.sendFile(__dirname +'/Public/Upload/records.xlsx');
});
app.get('/api/upload/timetable', (req, res) => {
  // res.sendFile(__dirname + '/Public/Upload/timetable.xlsx');
  TimeTable.find({}).then(
    (docs) => {
      var arr = [];
      for (i of docs){
      var k = {
        Date: i.Date,
        Time: i.Time,
        Session_No: i.Session_No,
        ClassRoom: i.ClassRoom,
        Subject: i.Subject,
      }; arr.push(k)}
      var xls = json2xls(arr);
      fs.writeFileSync(__dirname + '/Public/Latest/timetable.xlsx', xls, 'binary');
      console.log('hey');
      res.sendFile(__dirname + '/Public/Latest/timetable.xlsx');
    },
    (err) => res.send(err)
  );
});
app.get('/api/upload/users', (req, res) => {
  res.sendFile(__dirname + '/Public/Upload/users.xlsx');
});
app.get('/api/upload/subjects', (req, res) => {
  res.sendFile(__dirname + '/Public/Upload/subjects.xlsx');
});
app.get('/api/upload/subjectNames', (req, res) => {
  res.sendFile(__dirname + '/Public/Upload/subjectNames.xlsx');
});
app.use(passport.initialize());
app.use(passport.session());
routes(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is up on port:${PORT}`));
