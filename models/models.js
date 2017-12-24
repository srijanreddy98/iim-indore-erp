const mongoose = require('mongoose');
const { Schema } = mongoose;

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
  rollNo: String
});
const attendenceSchema = new Schema ({
  Name: String,
  Roll_No: String,
  In_Time: String,
  Out_Time: String,
  Duration: String,
  P_A: String,
  Class: String,
  Date: String,
  Session_No: String });
var User = mongoose.model('users', userSchema);
var Record = mongoose.model('records', attendenceSchema);

module.exports = { User, Record };
