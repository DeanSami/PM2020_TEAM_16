const request = require('supertest');
const app = require('../index');

describe('Admin Login With Empty Info', () => {
    it('Should return unsuccessfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '', pass: ''})
        .expect(401)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('status');
            expect(res.body.status).toEqual(false);
            done();
        });
    })
})

describe('Admin Login With Wrong Credentials', () => {
    it('Should return unsuccessfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '01', pass: '01'})
        .expect(401)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('status');
            expect(res.body.status).toEqual(false);
            done();
        });
    })
})

describe('Admin Login With Correct Credentials', () => {
    it('Should return unsuccessfull', done => {
        request(app)
        .post('/admin/login')
        .send({phone: '0666', pass: 'admin'})
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('status');
            expect(res.body.status).toEqual(true);
            expect(res.body).toHaveProperty('token')
            done();
        });
    })
})

app.close();