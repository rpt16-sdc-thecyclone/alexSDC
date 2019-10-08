const request = require('supertest');
const app = require('../server/app.js');

describe('Reviews', () => {
  it('should fetch product details', async (done) => {
    const res = await request(app).get('/reviews?prod_id=1').query({ user_id: 1, prod_id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('productDetails');
    expect(res.body.productDetails.seller).toEqual('Hara Morissette and Bashirian');
    done();
  });
  it('should fetch reviews', async (done) => {
    const res = await request(app).get('/reviews?prod_id=1').query({ user_id: 1, prod_id: 1 });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('reviews');
    expect(res.body.reviews).toHaveLength(9);
    done();
  });
});
