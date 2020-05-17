const request = require('supertest');
const app = require('../index');

const globals = require('../globals');

describe('Admin Login With Empty Info', () => {
    it('Should return unsuccessfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '', pass: ''})
        .expect(globals.status_codes.Unauthorized)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            done();
        });
    })
})

describe('Admin Login With Wrong Credentials', () => {
    it('Should return unsuccessfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '01', pass: '01'})
        .expect(globals.status_codes.Unauthorized)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            done();
        });
    })
})

describe('Admin Login With Correct Credentials', () => {
    it('Should return successfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '054test', pass: '1234test'})
        .expect(globals.status_codes.OK)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('user');
            done();
        });
    })
})

app.close();
