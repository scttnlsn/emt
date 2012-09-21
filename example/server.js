var express = require('express');
var mongoose = require('mongoose');
var notes = require('./notes');

var app = express();

app.configure(function() {
    app.use(express.bodyParser());
});

app.use('/notes', notes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/emt_example');

app.listen(3000);