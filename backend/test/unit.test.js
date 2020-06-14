const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();
const app = require('../index');

chai.use(chaiHttp);

const globals = require('../globals');

globals.mode = 'test';

describe('Admin Login With Empty Info', () => {
  it('Should return unsuccessfull', (done) => {
    chai.request(app)
      .post('/admin/login')
      .send({ phone: '', pass: '' })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(globals.status_codes.Unauthorized);
        res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        done();
      });
  });
});

describe('Admin Login With Wrong Credentials', () => {
  it('Should return unsuccessfull', (done) => {
    chai.request(app)
      .post('/admin/login')
      .send({ phone: '01', pass: '01' })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(globals.status_codes.Unauthorized);
        res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        done();
      });
  });
});

describe('Admin Login With Correct Credentials', () => {
  it('Should return successfull', (done) => {
    chai.request(app)
      .post('/admin/login')
      .send({ phone: '1231231231', pass: '123123' })
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(globals.status_codes.OK);
        res.should.have.header('Content-Type', 'application/json; charset=utf-8');
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        done();
      });
  });
});

app.close();
