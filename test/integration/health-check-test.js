const assert = require('chai').assert;
const request = require('supertest');

const app = require('../../src/app');

describe('health-check', () => {
  before(() => {
  });

  after(() => {
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('health test', (done) => {
    assert(app);
    request(app)
      .get('/health_check')
      .end((err, resp) => {
        assert.notOk(err);
        assert.equal(resp.status, 200);
        // add more checks in here later.
        done();
      });
  });
});
