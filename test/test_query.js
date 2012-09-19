var assert = require('assert');
var mongoose = require('mongoose');
var sinon = require('sinon');
var Model = require('./support/model');
var query = require('../lib/query');

describe('Query', function() {
    var req;

    beforeEach(function() {
        req = { model: Model };
    });

    describe('find', function() {
        var stub, q;

        beforeEach(function() {
            q = {};
            stub = sinon.stub(req.model, 'find').returns(q);
        });

        afterEach(function() {
            stub.restore();
        });

        it('creates find query', function(done) {
            var find = query.find();

            req.query = {};

            find(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(req.find, q);
                done();
            });
        });

        it('uses conditions from query string', function(done) {
            var find = query.find();

            req.query = { query: JSON.stringify({ foo: 'bar' }) };

            find(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });

        it('accepts query string param', function(done) {
            var find = query.find({ param: 'q' });

            req.query = { q: JSON.stringify({ foo: 'bar' }) };

            find(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });

        it('accepts query parser', function(done) {
            var find = query.find({
                parse: parser
            });

            req.query = { query: 'foo|bar' };

            find(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });
    });

    describe('limit', function() {
        var stub;

        beforeEach(function() {
            req.find = req.model.find();
            req.query = {};
            stub = sinon.stub(req.find, 'limit').returns(req.find);
        });

        afterEach(function() {
            stub.restore();
        });

        it('adds limit value to query', function(done) {
            var limit = query.limit();

            req.query.limit = 123;

            limit(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(stub.getCall(0).args[0], 123);
                done();
            });
        });

        it('accepts query string param', function(done) {
            var limit = query.limit({ param: 'size' });

            req.query.size = 123;

            limit(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 123);
                done();
            });
        });
    });

    describe('skip', function() {
        var stub;

        beforeEach(function() {
            req.find = req.model.find();
            req.query = {};
            stub = sinon.stub(req.find, 'skip').returns(req.find);
        });

        afterEach(function() {
            stub.restore();
        });

        it('adds skip value to query', function(done) {
            var skip = query.skip();

            req.query.skip = 123;

            skip(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(stub.getCall(0).args[0], 123);
                done();
            });
        });

        it('accepts query string param', function(done) {
            var skip = query.skip({ param: 'offset' });

            req.query.offset = 123;

            skip(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 123);
                done();
            });
        });
    });

    describe('select', function() {
        var stub;

        beforeEach(function() {
            req.find = req.model.find();
            req.query = {};
            stub = sinon.stub(req.find, 'select').returns(req.find);
        });

        afterEach(function() {
            stub.restore();
        });

        it('adds select value to query', function(done) {
            var select = query.select();

            req.query.select = 'foo,baz';

            select(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(stub.getCall(0).args[0], 'foo baz');
                done();
            });
        });

        it('accepts query string param', function(done) {
            var select = query.select({ param: 'fields' });

            req.query.fields = 'foo,baz';

            select(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 'foo baz');
                done();
            });
        });

        it('accepts field delimiter', function(done) {
            var select = query.select({ delimiter: '|' });

            req.query.select = 'foo|baz';

            select(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 'foo baz');
                done();
            });
        });
    });

    describe('sort', function() {
        var stub;

        beforeEach(function() {
            req.find = req.model.find();
            req.query = {};
            stub = sinon.stub(req.find, 'sort').returns(req.find);
        });

        afterEach(function() {
            stub.restore();
        });

        it('adds sort value to query', function(done) {
            var sort = query.sort();

            req.query.sort = 'foo,-baz';

            sort(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(stub.getCall(0).args[0], 'foo -baz');
                done();
            });
        });

        it('accepts query string param', function(done) {
            var sort = query.sort({ param: 'order' });

            req.query.order = 'foo,-baz';

            sort(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 'foo -baz');
                done();
            });
        });

        it('accepts field delimiter', function(done) {
            var sort = query.sort({ delimiter: '|' });

            req.query.sort = 'foo|-baz';

            sort(req, null, function() {
                assert.equal(stub.getCall(0).args[0], 'foo -baz');
                done();
            });
        });
    });

    describe('exec', function() {
        var stub;

        beforeEach(function() {
            req.find = req.model.find();
            req.query = {};
            stub = sinon.stub(req.find, 'exec').yields(null, [1, 2, 3]);
        });

        afterEach(function() {
            stub.restore();
        });

        it('executes find query', function(done) {
            var exec = query.exec();

            exec(req, null, function() {
                assert.ok(stub.calledOnce);
                done();
            });
        });

        it('stores results in req', function(done) {
            var exec = query.exec();

            exec(req, null, function() {
                assert.deepEqual(req.results, [1, 2, 3]);
                done();
            });
        });
    });

    describe('find', function() {
        var stub;

        beforeEach(function() {
            stub = sinon.stub(req.model, 'count').yields(null, 123);
        });

        afterEach(function() {
            stub.restore();
        });

        it('adds count to query', function(done) {
            var count = query.count();

            req.query = {};

            count(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(req.count, 123);
                done();
            });
        });

        it('uses conditions from query string', function(done) {
            var count = query.count();

            req.query = { query: JSON.stringify({ foo: 'bar' }) };

            count(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });

        it('accepts query string param', function(done) {
            var count = query.count({ param: 'q' });

            req.query = { q: JSON.stringify({ foo: 'bar' }) };

            count(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });

        it('accepts query parser', function(done) {
            var count = query.count({
                parse: parser
            });

            req.query = { query: 'foo|bar' };

            count(req, null, function() {
                assert.deepEqual(stub.getCall(0).args[0], { foo: 'bar' });
                done();
            });
        });
    });
});

// Helpers

function parser(str) {
    var parts = str.split('|');
    var query = {};
    query[parts[0]] = parts[1];
    return query;
}