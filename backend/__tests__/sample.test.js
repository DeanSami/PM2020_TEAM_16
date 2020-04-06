const request = require('supertest');
const app = require('../index');

describe('Index Endpoint', () => {
    it('should return hello world message', done => {
        request(app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('status');
            expect(res.body.status).toEqual(true);
            done();
        });
    })
})

app.close();