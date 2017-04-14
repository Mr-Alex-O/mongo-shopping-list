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
            Item.create({name: 'Broad beans'},
                        {name: 'Tomatoes'},
                        {name: 'Peppers'},
                        {name: 'Bread'}, function() {
                done();
            });
        });
    });

    after(function(done) {
        Item.remove(function() {
            done();
        });
    });
    
    it('should list items on get', function(done) {
            chai.request(app)
                .get('/items')
                .end(function(err, res) {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.have.length(4);
                    
                    chai.request(app)
                    .get('/items/'+ res.body[0]._id)
                    .end(function(err, res){
                        should.equal(err, null);
                        res.should.have.status(200);
                        res.body.name.should.equal('Broad beans');
                        done();
                    });
                });
        });
        
        
});