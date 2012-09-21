exports.find = function(options) {
    options || (options = {});
    options.param || (options.param = 'query');
    options.parse || (options.parse = JSON.parse);

    return function(req, res, next) {
        var query = req.query[options.param];
        var conditions = query ? options.parse(query) : {};
        req.find = req.model.find(conditions);
        next();
    };
};

exports.limit = function(options) {
    options || (options = {});
    options.param || (options.param = 'limit');

    return function(req, res, next) {
        if (req.query[options.param] !== undefined) {
            var limit = parseInt(req.query[options.param], 10);

            if (options.max) {
                limit = Math.min(limit, options.max);
            }
            
            req.find = req.find.limit(limit);
        }

        next();
    };
};

exports.skip = function(options) {
    options || (options = {});
    options.param || (options.param = 'skip');

    return function(req, res, next) {
        if (req.query[options.param] !== undefined) {
            var skip = parseInt(req.query[options.param], 10);
            req.find = req.find.skip(skip);
        }

        next();
    };
};

exports.select = function(options) {
    options || (options = {});
    options.param || (options.param = 'select');
    options.delimiter || (options.delimiter = ',');

    return function(req, res, next) {
        if (req.query[options.param] !== undefined) {
            var select = req.query[options.param].split(options.delimiter).join(' ');
            req.find = req.find.select(select);
        }

        next();
    };
};

exports.sort = function(options) {
    options || (options = {});
    options.param || (options.param = 'sort');
    options.delimiter || (options.delimiter = ',');

    return function(req, res, next) {
        if (req.query[options.param] !== undefined) {
            var sort = req.query[options.param].split(options.delimiter).join(' ');
            req.find = req.find.sort(sort);
        }

        next();
    };
};

exports.exec = function() {
    return function(req, res, next) {
        req.find.exec(function(err, results) {
            if (err) return next(err);

            req.results = results;
            next();
        });
    };
};

exports.count = function(options) {
    options || (options = {});
    options.param || (options.param = 'query');
    options.parse || (options.parse = JSON.parse);

    return function(req, res, next) {
        var query = req.query[options.param];
        var conditions = query ? options.parse(query) : {};

        req.model.count(conditions, function(err, count) {
            if (err) return next(err);

            req.count = count;
            next();
        });
    };
};