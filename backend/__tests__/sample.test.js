const request = require('supertest');
const app = require('../index');

describe('Index Endpoint', () => {
    it('should return hello world message', done => {
        request(app.app)
        .get('/')
        .expect(200)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toEqual('Hello World!');
            done();
        });
    })
})

app.app.close();