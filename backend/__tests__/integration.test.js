const request = require('supertest');
const app = require('../index');

const globals = require('../globals');
globals.mode = 'test';

describe('Business Owner Login, Creating new Business, and Editing a business info',  function() {
    it('Should login as a business owner.', function(done) {
        request(app)
            .get('/user/login')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .expect(globals.status_codes.OK)
            .end(function (err, login_res) {
                if (err) {
                    console.log('login test');
                    console.log(err);
                    return done(err);
                }
                expect(login_res.body).toHaveProperty('id');
                expect(login_res.body.id).toEqual(7);
                expect(login_res.body).toHaveProperty('user_type');
                expect(login_res.body.user_type).toEqual(2);
                expect(login_res.body).toHaveProperty('businesses');
                done();
            });
    });

    it('Should Create a new business.', function(done) {

        request(app)
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
            .expect(globals.status_codes.OK)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, create_result) {
                if (err) return done(err);
                done();
            });
    });

    it('Should perform edit on the business information.', function(done) {
        request(app)
            .patch('/user/business/edit')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                id: 6,
                name: "Integration Test Edit",
                owner_id: 7,
                phone: "086444444",
                type: 2
            })
            .expect(globals.status_codes.OK)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end(function(err, res) {
                if (err) return done(err);
                done();
            });
    });
});

describe('Creating new Trasure Hunt, and Editing a Treasure Hunt',  function() {
    it('Should Create a new Treasure Hunt.', function(done) {
        request(app)
            .post('/user/business/create')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                owner_id: 7,
                name: "Integration Test Game",
                start: new Date(),
                end: new Date(),
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
            .expect(globals.status_codes.OK)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, create_result) => {
                if (err) return done(err);
                done();
            });
    });

    it('Should Delete the last treasure hunt.', function(done) {
        request(app)
            .patch('/user/business/edit')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .send({
                id: 6,
                name: "Integration Test Edit",
                owner_id: 7,
                phone: "086444444",
                type: 2
            })
            .expect(globals.status_codes.OK)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});

app.close();
