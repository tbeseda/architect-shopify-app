const test = require('tape');
const crypto = require('crypto');
const nock = require('nock');

const getAuthCallback = require('../src/http/get-auth-callback');

const FAKE_SHOP = 'test-shop.myshopify.com';

const request = {
  session: {},
  query: {
    host: 'bar',
    locale: 'en',
    session: 'baz',
    timestamp: 1337,
    shop: FAKE_SHOP,
  },
};

test('fails Hmac verification with an invalid query', async (t) => {
  t.plan(1);

  const result = await getAuthCallback(request);

  t.equal(result.statusCode, 401, 'sends 401 unauthorized');
});

test('acquires a permanent access token after validation', async (t) => {
  t.plan(3);

  nock(`https://${FAKE_SHOP}`)
    .post('/admin/oauth/access_token')
    .reply(200, { access_token: 'supersecretkeyboardcat' });

  const querystring = Object.keys(request.query)
    .map((key) => `${key}=${request.query[key]}`)
    .join('&');

  const hmac = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(querystring)
    .digest('hex');

  const signedRequest = { ...request };
  signedRequest.query.hmac = hmac;

  const result = await getAuthCallback(signedRequest);

  t.equal(result.statusCode, 302, 'sends redirect status');
  t.ok(result.headers, 'headers exist');
  t.equal(
    result.headers.location,
    `/dashboard?shop=${FAKE_SHOP}`,
    'redirects to dashboard with shop'
  );
});
