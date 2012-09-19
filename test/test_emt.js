var assert = require('assert');
var emt = require('../lib/index');

describe('Emt', function() {
    it('exports CRUD middleware', function() {
        assert.ok(emt.crud);
    });

    it('exports Query middleware', function() {
        assert.ok(emt.query);
    });

    describe('middleware', function() {
        it('sets model in request', function(done) {
            var req = {};

            var model = emt.model('test');

            model(req, null, function() {
                assert.equal(req.model, 'test');
                done();
            });
        });
    });
});