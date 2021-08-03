const getAuth = require('../src/http/get-auth');
const getAuthCallback = require('../src/http/get-auth-callback');

const shop = 'test-shop.myshopify.com';

describe('Shopify Auth start', () => {
  it('fails authentication without a shop param', async () => {
    const request = { query: {} };
    const result = await getAuth(request);

    expect(result.statusCode).toBe(401);
  });

  it('redirects to Shopify Oauth provider', async () => {
    const request = { query: { shop } };
    const result = await getAuth(request);

    expect(result.statusCode).toBe(302);
    expect(result.headers).toBeInstanceOf(Object);
    expect(result.headers.location).toContain(
      `https://${shop}/admin/oauth/authorize`
    );
  });
});

describe('Shopify Auth callback', () => {
  it('fails Hmac verification with an invalid query', async () => {
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

    expect(result.statusCode).toBe(401);
  });

  it.skip('acquires a permanent access token after validation', async () => {
    const request = { query: { shop } };
    const result = await getAuthCallback(request);

    expect(result.statusCode).toBe(302);
    expect(result.headers).toBeInstanceOf(Object);
    expect(result.headers.location).toContain(
      `https://${shop}/admin/oauth/authorize`
    );
  });
});
