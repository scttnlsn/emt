var assert = require('assert');
var sinon = require('sinon');
var Model = require('./support/model');
var crud = require('../lib/crud');

describe('CRUD', function() {
    var req;

    beforeEach(function() {
        req = { model: Model };
    });

    describe('create', function() {
        beforeEach(function() {
            req.body = { foo: 'bar', baz: 'qux' };
        });

        it('creates instance of model from req body', function(done) {
            var create = crud.create();

            create(req, null, function() {
                assert.ok(req.instance);
                assert.ok(req.instance instanceof req.model);
                assert.ok(req.instance.isNew);
                var attrs = req.instance.toObject();
                assert.equal(attrs.foo, 'bar');
                assert.equal(attrs.baz, 'qux');
                done();
            });
        });

        it('accepts whitelist of fields', function(done) {
            var create = crud.create({ fields: ['foo'] });

            create(req, null, function() {
                var attrs = req.instance.toObject();
                assert.equal(attrs.foo, 'bar');
                assert.ok(!attrs.baz);
                done();
            });
        });
    });

    describe('load', function() {
        var stub;

        beforeEach(function() {
            req.params = { id: '1234' };
            stub = sinon.stub(Model, 'findById').yields(null, new Model());
        });

        afterEach(function() {
            stub.restore();
        });

        it('finds model by id', function(done) {
            var load = crud.load();

            load(req, null, function() {
                assert.ok(stub.calledOnce);
                assert.equal(stub.getCall(0).args[0], '1234');
                done();
            });
        });

        it('sets instance in req', function(done) {
            var load = crud.load();

            load(req, null, function() {
                assert.ok(req.instance);
                assert.ok(req.instance instanceof Model);
                done();
            });
        });

        it('accepts id param', function(done) {
            req.params = { foo: '1234' };

            var load = crud.load({ param: 'foo' });

            load(req, null, function() {
                assert.equal(stub.getCall(0).args[0], '1234');
                done();
            });
        });
    });

    describe('update', function() {
        beforeEach(function() {
            req.body = { foo: 'bar', baz: 'qux' };
            req.instance = new Model();
        });

        it('updates model attributes from req body', function(done) {
            var update = crud.update();

            update(req, null, function() {
                var attrs = req.instance.toObject();
                assert.equal(attrs.foo, 'bar');
                assert.equal(attrs.baz, 'qux');
                done();
            });
        });

        it('accepts whitelist of fields', function(done) {
            var update = crud.update({ fields: ['foo'] });

            update(req, null, function() {
                var attrs = req.instance.toObject();
                assert.equal(attrs.foo, 'bar');
                assert.ok(!attrs.baz);
                done();
            });
        });
    });

    describe('save', function() {
        var stub;

        beforeEach(function() {
            req.instance = new Model();
            stub = sinon.stub(req.instance, 'save').yields(null, req.model);
        });

        afterEach(function() {
            stub.restore();
        });

        it('saves model instance', function(done) {
            var save = crud.save();

            save(req, null, function() {
                assert.ok(stub.calledOnce);
                done();
            });
        });
    });

    describe('remove', function() {
        var stub;

        beforeEach(function() {
            req.instance = new Model();
            stub = sinon.stub(req.instance, 'remove').yields(null, req.model);
        });

        afterEach(function() {
            stub.restore();
        });

        it('removes model instance', function(done) {
            var remove = crud.remove();

            remove(req, null, function() {
                assert.ok(stub.calledOnce);
                done();
            });
        });
    });
});