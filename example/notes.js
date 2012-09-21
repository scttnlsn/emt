var express = require('express');
var emt = require('../lib/index');
var mongoose = require('mongoose');

var Note = mongoose.model('Note', new mongoose.Schema({
    name: { type: String, required: true },
    body: { type: String }
}));

var notes = module.exports = express();

notes.use(emt.model(Note));

notes.get('/',
    emt.query.find(),
    emt.query.limit(),
    emt.query.skip(),
    emt.query.select(),
    emt.query.sort(),
    emt.query.exec(),
    emt.query.count(),
    function(req, res) {
        res.json({
            results: req.results,
            total: req.count
        });
    }
);

var notfound = function(req, res, next) {
    if (!req.instance) {
        res.json({ error: 'Note not found' }, 404);
    } else {
        next();
    }
};

notes.post('/',
    emt.crud.create(),
    emt.crud.save(),
    emt.json.show({ status: 201 })
);

notes.get('/:id',
    emt.crud.load(),
    notfound,
    emt.json.show()
);

notes.put('/:id',
    emt.crud.load(),
    notfound,
    emt.crud.update(),
    emt.crud.save(),
    emt.json.show()
);

notes.del('/:id',
    emt.crud.load(),
    notfound,
    emt.crud.remove(),
    emt.json.show({ status: 204 })
);