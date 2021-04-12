var should = require("should");
var request = require("request");
var chai = require("chai");
var expect = chai.expect;
var urlBase = "http://localhost:3333";

describe("testing of proto-atm user endpoints", function(){
    it("get all users", function(done){
        request.get({url: urlBase + "/users"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);

            expect(_body).to.have.lengthOf.at.least(3);

            done();
        });
    });

    it("get user with CPF 12345678900", function(done){
        request.get({url: urlBase + "/users/12345678900"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(200);

            expect(_body).to.have.property('name');
            expect(_body).to.have.property('cpf');
            expect(_body).to.have.property('b_date');

            expect(_body.cpf).to.equal('12345678900');

            done();
        });
    });

    it("try to get user with non-existent CPF 55588855522", function(done){
        request.get({url: urlBase + "/users/55588855522"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(404);

            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('No user found with provided CPF');

            done();
        });
    });

    it("try to insert a new user with an empty name", function(done){

        var outgoingReq = {
            url: urlBase + "/users",
            body: {"name":"","cpf":"55588855522","b_date":"1984-02-28"},
            json: true
        }

        request.post(outgoingReq, function(error, response, body){
            expect(response.statusCode).to.equal(400);
            expect(body).to.have.property('error');
            expect(body.error).to.equal('Name must not be an empty string');

            done();
        });
    });

    it("try to insert a new user with CPF of incorrect size", function(done){

        var outgoingReq = {
            url: urlBase + "/users",
            body: {"name":"Commodus","cpf":"5558885552","b_date":"1984-02-28"},
            json: true
        }

        request.post(outgoingReq, function(error, response, body){
            expect(response.statusCode).to.equal(400);
            expect(body).to.have.property('error');
            expect(body.error).to.equal('CPF must be informed with exactly 11 digits');

            done();
        });
    });

    it("insert a new user", function(done){

        var outgoingReq = {
            url: urlBase + "/users",
            body: {"name":"Commodus","cpf":"55588855522","b_date":"1984-02-28"},
            json: true
        }

        request.post(outgoingReq, function(error, response, body){
            expect(response.statusCode).to.equal(201);
            done();
        });
    });

    it("try to insert an user with duplicated CPF", function(done){

        var outgoingReq = {
            url: urlBase + "/users",
            body: {"name":"Commodus","cpf":"55588855522","b_date":"1984-02-28"},
            json: true
        }

        request.post(outgoingReq, function(error, response, body){
            expect(response.statusCode).to.equal(400);
            expect(body).to.have.property('error');
            expect(body.error).to.equal('Provided CPF already in use');

            done();
        });
    });

    it("try to delete user with CPF 55588855522", function(done){
        request.delete({url: urlBase + "/users/55588855522"}, function(error, response, body){
            expect(response.statusCode).to.equal(200);
            done();
        });
    });

    it("try to delete user with non-existent CPF 55588855522", function(done){
        request.delete({url: urlBase + "/users/55588855522"}, function(error, response, body){
            var _body = {};
            try{
                _body = JSON.parse(body);
            }
            catch(e){
                _body = {};
            }
            expect(response.statusCode).to.equal(404);
            expect(_body).to.have.property('error');
            expect(_body.error).to.equal('No user found with provided CPF');
            done();
        });
    });

// end
  });