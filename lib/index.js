exports.crud = require('./crud');
exports.json = require('./json');
exports.query = require('./query');

exports.model = function(model) {
    return function(req, res, next) {
        req.model = model;
        next();
    };
};