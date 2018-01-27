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
    var Date = '';
    var Day = '';
    for (i of xlData) {
        var j = 1;
        if (i.Date) {
            var da = i.Date.split('/');
            Date = da[2] + '-' + da[1] + '-' + da[0];
            Day = i.Day;
        }
        nm = 1;
        while (nm < 10) {
            if (i['Session ' + nm]) {
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