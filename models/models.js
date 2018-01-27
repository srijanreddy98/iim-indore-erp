const mongoose = require('mongoose');
const { Schema } = mongoose;
const {ObjectID} = require('mongodb');

const userSchema = new Schema({
    googleId: {
        type: String,
        default: null
    },
    firstName: {
        type: String,
        default: null
    },
    lastName: {
        type: String,
        default: null
    },
    email: String,
    rollNo: String,
    isAdmin: {
      type: Boolean,
      default: false
    }
});

const attendenceSchema = new Schema({
    Name: String,
    Roll_No: String,
    In_Time: String,
    Out_Time: String,
    Duration: String,
    P_A: String,
    Class: String,
    Date: String,
    Session_No: String
});

const subjectsSchema = new Schema({
    Subject: String,
    Roll_No: String
});

const timeTableSchema = new Schema({
    Subject: String,
    Day: String,
    Date: String,
    Time: String,
    Session_No: String,
    ClassRoom: String
});
const studentReportSchema = new Schema({
    AttendanceId: String,
    StudentProblem: {
      type: String,
      default: ''
    },
    AdminResponse: {
      type: String,
      default: null
    },
    Responded: {
      type: Boolean,
      default: false
    }
});
var User = mongoose.model('users', userSchema);
var Record = mongoose.model('records', attendenceSchema);
var Subject = mongoose.model('subjects', subjectsSchema);
var TimeTable = mongoose.model('timeTable', timeTableSchema);
var StudentReport = mongoose.model('studentReport', studentReportSchema);
module.exports = { User, Record, Subject, TimeTable, StudentReport };
