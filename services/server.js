const express = require('express');
const {router} = require('./routes/authRoutes');
const {keys} = require('./config/keys');
const mongoose = require('mongoose');
const moment = require('moment');
var XLSX = require('xlsx')
var workbook = XLSX.readFile('SubjectNames.xlsx');
const { User, Record, Subject, TimeTable } = require('./models/models');
var sheet_name_list = workbook.SheetNames;
var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var workbook = XLSX.readFile('Test.xlsx');
var sheet_name_list = workbook.SheetNames;
var xlData2 = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
var j = 0;
var subs = [];
var toPush = [];
for (i of xlData){
  k = i.SUBJECT;
  subs.push(k);
}
var Date = '';
var Day = '';
// console.log(subs);
for (i of xlData2){
    var j = 1;
    if (i.Date) {
      var da = i.Date.split('/');
      Date = da[2] +'-'+ da[1] +'-'+ da[0];
      Day = i.Day;
    }
    nm = 1;
    while (nm < 10) {
      if(i['Session ' + nm]) {
        var tim = {
          Day: Day,
          Date: moment(Date),
          Time: nm,
          Session_No: i['Session ' + nm].split(' ')[1],
          ClassRoom: i['Classroom No.'],
          Subject: i['Session ' + nm].split(' ')[0]
        };
        toPush.push(tim);
      }
      nm++;
    }
  // for ( sub of subs) {
  //   if(i[sub]) {// console.log(sub, i.Roll_No);
  //     var dat = {
  //       Subject: sub,
  //       Roll_No: i.Roll_No
  //     }
  //     var subject = new Subject(dat);
  //     subject.save().then(
  //       (doc) => {console.log(j); j++},
  //     )
  //   }
  // }

    // var record = new Record(i);
    // record.save().then(
    //   (doc) => {console.log(j);j++},
    //   (err) => console.log('Err')
    // );


    // var user = new User({email : i.Email, rollNo: i.Student_Code});
    // user.save();


    // j++;
    // console.log(j);
}
for (i of toPush) {
  var j = 1;
  var timeTable = new TimeTable(i);
  timeTable.save().then(
    (doc) => { console.log(j); j++ }
  )
}
mongoose.connect("mongodb://srijanreddy98:chintu98@ds161336.mlab.com:61336/iimindoredb");
var app = express();
// mongoose.Promise = global.Promise;

router(app);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server Started'));
