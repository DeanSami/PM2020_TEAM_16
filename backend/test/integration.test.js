var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
const app = require('../index');

chai.use(chaiHttp);

const globals = require('../globals');
globals.mode = 'test';

describe('Business Owner Login, Creating new Business, and Editing a business info',  function() {
    it('Should login as a business owner.', function(done) {
        chai.request(app)
            .get('/login')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .end(function (err, login_res) {
                if (err) {
                    console.log('login test');
                    console.log(err);
                    return done(err);
                }
                login_res.should.have.status(globals.status_codes.OK)
                login_res.body.should.have.property('id');
                login_res.body.id.should.equal(7);
                login_res.body.should.have.property('user_type');
                login_res.body.user_type.should.equal(2);
                login_res.body.should.have.property('businesses');
                done();
            });
    });

    it('Should Create a new business.', function(done) {
        chai.request(app)
            .post('/user/business/create')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                name: "Create Business Integration test",
                owner_id: 7,
                dog_friendly: "1",
                description: "Integration Test Description",
                phone: "054Test",
                image: "",
                address: "Integration Test",
                type: 2
            })
            .end(function(err, create_result) {
                if (err) return done(err);
                create_result.should.have.status(globals.status_codes.OK);
                create_result.should.have.header('Content-Type', 'application/json; charset=utf-8');
                done();
            });
    });

    it('Should perform edit on the business information.', function(done) {
        chai.request(app)
            .patch('/user/business/edit')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                id: 6,
                name: "Integration Test Edit",
                owner_id: 7,
                phone: "086444444",
                type: 2
            })
            .end(function(err, res) {
                if (err) return done(err);
                res.should.have.status(globals.status_codes.OK);
                res.should.have.header('Content-Type', 'application/json; charset=utf-8');
                done();
            });
    });
});

describe('Creating new Trasure Hunt, and Editing a Treasure Hunt',  function() {
    it('Should Create a new Treasure Hunt, then edit it.', function(done) {
        chai.request(app)
            .post('/user/games/create')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                owner_id: 7,
                name: "Integration Test Game",
                start: "2020-05-05 14:00:00",
                end: "2020-05-05 14:00:00",
                start_location: 1,
                finish_location: 2,
                steps: [
                    {
                        step_num: 1,
                        name: "Integration Test Game Step",
                        secret_key: "Integration Test Game Secret Key",
                        start_location: 2,
                        finish_location: 3,
                        description: "Integration Test Game Step description"
                    }
                ]
            })
            .end((err, create_result) => {
                if (err) return done(err);
                create_result.should.have.status(globals.status_codes.OK);
                create_result.should.have.header('Content-Type', 'application/json; charset=utf-8');
                create_result.should.have.property('body');
                create_result.body.should.have.property('id');
                chai.request(app)
                    .patch('/user/games/edit')
                    .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
                    .send({
                        id: create_result.body.id,
                        owner_id: 7,
                        name: "Integration test edit",
                        start: "2020-05-05 14:00:00",
                        end: "2020-05-05 14:00:00",
                        start_location: 2,
                        finish_location: 3
                    })
                    .end((err, edit_res) => {
                        if (err) return done(err);
                        edit_res.should.have.status(globals.status_codes.OK);
                        edit_res.should.have.header('Content-Type', 'application/json; charset=utf-8');
                        done();
                    });

            });
    });

});

describe('Business Owner login, Get all Business Owner Current Games',  function() {
    it('Should login as a business owner.', function(done) {
        chai.request(app)
            .get('/login')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .end(function (err, login_res) {
                if (err) {
                    console.log('login test');
                    console.log(err);
                    return done(err);
                }
                login_res.should.have.status(globals.status_codes.OK);
                login_res.body.should.to.have.property('id');
                login_res.body.id.should.to.equal(7);
                login_res.body.should.to.have.property('user_type');
                login_res.body.user_type.should.to.equal(2);
                login_res.body.should.to.have.property('businesses');
                done();
            });
    });
    it('Should Get all games for business owner.', function(done) {
        chai.request(app)
            .get('/games?owner_id=7')
            .end((err, res) => {
                if (err) return done(err);
                res.should.have.status(globals.status_codes.OK)
                res.should.have.header('Content-Type', 'application/json; charset=utf-8')
                res.body.should.to.be.instanceOf(Array);
                done();
            })
    });
});

app.close();
