const test = require('tape');
const getAuth = require('../src/http/get-auth');

const shop = 'test-shop.myshopify.com';

test('fails authentication without a shop param', async (t) => {
  t.plan(1);

  const request = { query: {} };
  const result = await getAuth(request);

  t.equal(result.statusCode, 401, 'sends 401 unauthorized');
});

test('redirects to Shopify OAuth provider', async (t) => {
  t.plan(3);

  const request = { query: { shop } };
  const result = await getAuth(request);

  t.equal(result.statusCode, 302, 'sends redirect status');
  t.ok(result.headers, 'headers exist');
  t.true(
    result.headers.location.indexOf(`https://${shop}/admin/oauth/authorize`) ===
      0,
    'redirects to Shopify OAuth provider'
  );
});
