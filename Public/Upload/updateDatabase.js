const mongoose = require('mongoose');
const moment = require('moment');
var XLSX = require('xlsx');
const { User, Record, Subject, TimeTable } = require('../../models/models');

var updateTimeTable = () => {
    TimeTable.remove({}, function (err) { if (err) return handleError(err);});
    var workbook = XLSX.readFile('./Public/Upload/timetable.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var toPush = [];
    for (i of xlData) {
        var da = i.Date.split('/');
        var date = da[2] + '-' + da[1] + '-' + da[0];
        console.log(date);
        var tim = {
            Date: moment(date, 'YY-DD-MM').isValid() ? moment(date, 'YY-DD-MM') : date,
            Time: i.Day_Session.split(' ')[1],
            Session_No: i.Class_No,
            ClassRoom: i['Classroom'],
            Subject: i.Subjects
        };
        toPush.push(tim);
    }
    for (i of toPush) {
        var j = 1;
        var timeTable = new TimeTable(i);
        timeTable.save().then(
            (doc) => { console.log(j); j++ }
        )
    }
}

var updateSubjects = () => {
    Subject.remove({}, function (err) { if (err) return handleError(err); });
    var workbook = XLSX.readFile('./Public/Upload/subjectNames.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var subs = [];
    for (i of xlData) {
        k = i.SUBJECT;
        subs.push(k);
    }
    var workbook = XLSX.readFile('./Public/Upload/subjects.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    var j =0 ;
    for (i of xlData) {
        for ( sub of subs) {
            if(i[sub]) {// console.log(sub, i.Roll_No);
            var dat = {
                Subject: sub,
                Roll_No: i.Roll_No
            }
            var subject = new Subject(dat);
            subject.save().then(
                (doc) => {console.log(j); j++},
            )
            }
        }
    }
}

var updateRecords = () => {
    var j = 0;
    Record.remove({}, function (err) { if (err) return handleError(err); });
    var workbook = XLSX.readFile('./Public/Upload/records.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    for (i of xlData) {
        var record = new Record(i);
        record.save().then(
        (doc) => {console.log(j);j++},
        (err) => console.log('Err')
        );
    }
}

var updateUsers = () => {
    User.remove({}, function (err) { if (err) return handleError(err); });
    var workbook = XLSX.readFile('./Public/Upload/users.xlsx');
    var sheet_name_list = workbook.SheetNames;
    var xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    for (i of xlData) {
    var user = new User({email : i.Email, rollNo: i.Student_Code});
    user.save();
    }
}
mongoose.connect("mongodb://srijanreddy98:chintu98@ds161336.mlab.com:61336/iimindoredb");

module.exports = {updateUsers, updateRecords, updateTimeTable, updateSubjects};