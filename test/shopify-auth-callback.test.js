const test = require('tape');
const getAuthCallback = require('../src/http/get-auth-callback');

const shop = 'test-shop.myshopify.com';

test('fails Hmac verification with an invalid query', async (t) => {
  t.plan(1);

  const request = {
    query: {
      hmac: 'foo',
      host: 'bar',
      locale: 'en',
      session: 'baz',
      timestamp: 1337,
      shop,
    },
  };
  const result = await getAuthCallback(request);

  t.equal(result.statusCode, 401);
});

test.skip('acquires a permanent access token after validation', async (t) => {
  t.plan(3);

  const request = { query: { shop } };
  const result = await getAuthCallback(request);

  t.equal(result.statusCode, 302, 'sends redirect status');
  t.ok(result.headers, 'headers exist');
  t.equal(
    result.headers.location,
    `/dashboard?shop=${shop}`,
    'redirects to dashboard with shop'
  );
});
