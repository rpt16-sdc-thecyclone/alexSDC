const request = require('supertest');
const app = require('../server/app.js');

describe('Reviews', () => {
  it('should fetch product details', async (done) => {
    const res = await request(app).get('/reviews');
    expect(res.statusCode).toEqual(200);
    expect(res.body.productDetails.seller).toEqual('Hara Morissette and Bashirian');
    done();
  });
  it('should fetch review details', async (done) => {
    const res = await request(app).get('/reviews');
    expect(res.statusCode).toEqual(200);
    expect(res.body.reviews.length).toEqual(9);
    done();
  });
});
