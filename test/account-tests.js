var request = require("request");
var chai = require("chai");
var expect = chai.expect;
var urlBase = "http://localhost:3333";

describe("testing of proto-atm account endpoints", function(){
    it("get account of CPF 12345678900", function(done){
        request.get({url: urlBase + "/accounts/cpf/12345678900"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);
            expect(_body).to.have.lengthOf.at.least(1);
            done();
        });
    });

    it("get accounts of CPF 00011122233", function(done){
        request.get({url: urlBase + "/accounts/cpf/00011122233"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);
            expect(_body).to.have.lengthOf.at.least(2);
            done();
        });
    });

    it("get account with id 4", function(done){
        request.get({url: urlBase + "/accounts/4"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("try to deposit 80 currency on non-existent account with id 0", function(done){
        request.put({url: urlBase + "/accounts/0/deposit/80"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(404);
            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('No user found with provided id');
            done();
        });
    });

    it("try to deposit -80 currency on account with id 4", function(done){
        request.put({url: urlBase + "/accounts/4/deposit/-80"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(400);
            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('Tried to deposit negative quantity');
            done();
        });
    });

    it("deposit 80 currency on account with id 4", function(done){
        request.put({url: urlBase + "/accounts/4/deposit/80"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("try to withdraw 30 currency on account with id 4", function(done){
        request.put({url: urlBase + "/accounts/4/withdraw/30"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(400);
            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('Not possible to allocate bank notes for requested amount');
            done();
        });
    });

    it("withdraw 80 currency on account with id 4", function(done){
        request.put({url: urlBase + "/accounts/4/withdraw/80"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("try to withdraw 90000 currency on account with id 4", function(done){
        request.put({url: urlBase + "/accounts/4/withdraw/90000"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(400);
            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('Account does not have enough balance for requested amount');
            done();
        });
    });

// end
  });