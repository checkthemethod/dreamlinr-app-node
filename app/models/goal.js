// app/models/goal.js

var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var GoalSchema   = new Schema({
    name: String
});

module.exports = mongoose.model('Goal', GoalSchema);