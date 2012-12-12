exports.show = function(options) {
    options || (options = {});
    options.status || (options.status = 200);

    return function(req, res) {
        if (options.status === 204) {
            res.send(204);
        } else {
            res.json(req.instance, options.status);
        }
    };
};

exports.results = function() {
    return function(req, res, next) {
        res.json(req.results);
    };
};