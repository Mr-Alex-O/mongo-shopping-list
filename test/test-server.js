global.DATABASE_URL = 'mongodb://localhost/shopping-list-test';

var chai = require('chai');
var chaiHttp = require('chai-http');

var server = require('../server.js');
var Item = require('../models/item');

var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shopping List', function() {
    before(function(done) {
        server.runServer(function() {
            Item.create({
                name: 'Broad beans'
            }, {
                name: 'Tomatoes'
            }, {
                name: 'Peppers'
            }, function() {
                done();
            });
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });


    describe('Thinkful Examples', function() {
        it('should list items on get', function(done) {
            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.have.length(3);

                    chai.request(app)
                        .get('/items/' + res.body[0]._id)
                        .end(function(err, res) {
                            should.equal(err, null);
                            res.should.have.status(200);
                            res.body.name.should.equal('Broad beans');
                            done();
                        });
                });
        });

        it('should add an item on post', function(done) {
            chai.request(app)
                .post('/items')
                .send({
                    'name': 'Kale'
                })
                .end(function(err, res) {
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('_id');
                    res.body.name.should.be.a('string');
                    res.body._id.should.exist;
                    res.body.name.should.equal('Kale');
                    done();
                });
        });

        it('should edit an item on PUT', function(done) {

            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    should.equal(err, null);

                    chai.request(app)
                        .put('/items/' + res.body[0]._id)
                        .send({
                            'name': 'Beer'
                        })
                        .end(function(err, response) {
                            should.equal(err, null);
                            response.should.have.status(204);
                            done();
                        })
                })
        });
        it('should Delete an item', function(done) {
            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    chai.request(app)
                        .delete('/items/' + res.body[0]._id)
                        .end(function(error, response1) {
                            response1.should.have.status(204);

                            chai.request(app)
                                .get('/items')
                                .end(function(error, response) {
                                    should.equal(err, null);

                                    done();
                                });

                        });
                });
        });
    }); // end of thinkful describe

    describe('POST routes', function() {
        it('should POST to an ID that exists', function(done) {

            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    chai.request(app)
                        .post('/items')
                        .send({
                            'name': 'Kale'
                        })
                        .end(function(err, res) {
                            should.equal(err, null);
                            res.should.have.status(201);
                            res.should.be.json;
                            res.body.should.be.a('object');
                            res.body.should.have.property('name');
                            res.body.should.have.property('_id');
                            res.body.name.should.be.a('string');
                            res.body._id.should.exist;
                            res.body.name.should.equal('Kale');
                            done();
                        });
                })


        });
        it('should POST without body data', function(done) {
            chai.request(app)
                .post('/items')
                .end(function(err, res) {
                    should.not.equal(err, null);
                    res.should.have.status(500);
                    done();
                });

        });
        it('should POST with something other than valid JSON', function(done) {
            chai.request(app)
                .post('/items')
                .send('Kale')
                .end(function(err, res) {
                    should.not.equal(err, null);
                    res.should.have.status(500);
                    done();
                });
        });
    }); //end of post describe
    
     describe('PUT routes', function(){
        it('should not PUT without an ID in the endpoint', function(done){
            chai.request(app)
                .put('/items/')
                .send({name: 'Pizza'})
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(404);
                    done();
                })
                
        });
        it('should not PUT with different ID in the endpoint than the body', function(done){
            chai.request(app)
                .put('/items/2')
                .send({name: 'Pizza', id: 123})
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(500);
                    done();
                });
        });
        it('should not PUT to an ID that doesn\'t exist', function(done){
            chai.request(app)
                .put('/items/123')
                .send({name:'Salami'})
                .end(function(err, res){
                    should.not.equal(err, res);
                    res.should.have.status(500);
                    done();
                });
        });
        it('should not PUT without body data', function(done){
            chai.request(app)
                .put('/items/1')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(500);
                   done();
                });
        });
        it('should not PUT with something other than valid JSON', function(done){
            chai.request(app)
                .put('/items/2')
                .send('kale')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(500);
                   done();
                });
        });
    }); // end of PUT describe
    
    describe('DELETE routes', function(){
        it('should not DELETE an ID that doesn\'t exist', function(done){
            chai.request(app)
                .delete('/items/123')
                .end(function(err, res){
                   should.not.equal(err, null);
                   res.should.have.status(500);
                   done();
                });
        });
        it('should not DELETE without an ID in the endpoint', function(done){
            chai.request(app)
                .delete('/items/')
                .end(function(err, res){
                    should.not.equal(err, null);
                    res.should.have.status(404);
                    done();
                });
        });
    });

});
