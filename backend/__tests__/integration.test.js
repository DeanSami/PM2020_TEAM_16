const request = require('supertest');
const app = require('../index');

const globals = require('../globals');

describe('Business Owner Login and Creating new Business',  () => {
    it('Should login as a business owner.', done => {
        request(app)
            .get('/user/login')
            .set('x-auth', '9fcebfae4ea0d68e8cc51ef3ec849904')
            .expect(globals.status_codes.OK)
            .end((err, login_res) => {
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

    it('Should Create a new business.', done => {

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
            .end((err, create_result) => {
                if (err) return done(err);
                done();
            });
    });

    it('Should perform edit on the business information.', done => {
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
