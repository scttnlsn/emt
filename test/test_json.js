var assert = require('assert');
var sinon = require('sinon');
var Model = require('./support/model');
var json = require('../lib/json');

describe('JSON', function() {
    var req, res;

    beforeEach(function() {
        req = {
            instance: new Model({ foo: 'bar' }),
            results: [1, 2, 3]
        };

        res = {
            json: function() {},
            send: function() {}
        };
    });

    describe('show', function() {
        it('returns instance attributes', function() {
            var show = json.show();
            var spy = sinon.spy(res, 'json');

            show(req, res);

            assert.ok(spy.calledOnce);

            var data = spy.getCall(0).args[0];
            assert.equal(data.foo, 'bar');
            assert.ok(data._id);

            spy.restore();
        });

        it('returns 200 status', function() {
            var show = json.show();
            var spy = sinon.spy(res, 'json');

            show(req, res);
            assert.equal(spy.getCall(0).args[1], 200);

            spy.restore();
        });

        it('accepts status option', function() {
            var show = json.show({ status: 201 });
            var spy = sinon.spy(res, 'json');

            show(req, res);
            assert.equal(spy.getCall(0).args[1], 201);

            spy.restore();
        });

        it('returns nothing if status is 204', function() {
            var show = json.show({ status: 204 });
            var spy = sinon.spy(res, 'send');

            show(req, res);
            assert.ok(spy.calledOnce);
            assert.equal(spy.getCall(0).args[0], 204);

            spy.restore();
        });
    });

    describe('results', function() {
        it('returns results', function() {
            var results = json.results();
            var spy = sinon.spy(res, 'json');

            results(req, res);
            assert.ok(spy.calledOnce);
            assert.deepEqual(spy.getCall(0).args[0], [1, 2, 3]);

            spy.restore();
        });
    });
});