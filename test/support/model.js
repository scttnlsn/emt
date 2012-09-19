var mongoose = require('mongoose');

var Test = new mongoose.Schema({
    foo: String,
    baz: String
});

module.exports = mongoose.model('Test', Test);