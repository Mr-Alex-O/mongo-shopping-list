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
                    }, {
                        name: 'Bread'
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

                // it('should edit an item on PUT', function(done) {

                //     chai.request(app)
                //         .get('/items')
                //         .end(function(err, res) {
                //             chai.request(app)
                //                 .put('/items/' + res.body[0].id)
                //                 .send({
                //                     _id: res.body[0].id
                //                 }, {
                //                     'name': 'Beer'
                //                 })
                //                 .end(function(err, response) {
                //                     response.should.have.status(204);
                //                     done();
                //                 })
                //         })
                // });
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
                                            console.log(response.body);
                                            console.log(res.body[0]._id);
                                            should.equal(err, null);

                                            done();
                                        });

                                });
                        });
                });

            });
