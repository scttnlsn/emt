exports.create = function(options) {
    options || (options = {});

    return function(req, res, next) {
        var data = {};
        var fields = options.fields || Object.keys(req.body);

        fields.forEach(function(field) {
            data[field] = req.body[field];
        });

        req.instance = new req.model(data);
        next();
    };
};

exports.load = function(options) {
    options || (options = {});
    options.param || (options.param = 'id');

    return function(req, res, next) {
        var id = req.params[options.param];

        req.model.findById(id, function(err, instance) {
            if (err) return next(err);

            req.instance = instance;
            next();
        });
    };
};

exports.update = function(options) {
    options || (options = {});

    return function(req, res, next) {
        var data = {};
        var fields = options.fields || Object.keys(req.body);

        fields.forEach(function(field) {
            data[field] = req.body[field];
        });

        for (var field in data) {
            req.instance[field] = data[field];
        }

        next();
    };
};

exports.save = function() {
    return function(req, res, next) {
        req.instance.save(next);
    };
};

exports.remove = function() {
    return function(req, res, next) {
        req.instance.remove(next);
    };
};