const crypto = require('crypto');
const arc = require('@architect/functions');
const tiny = require('tiny-json-http');

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;

function verifyHmac(query) {
  const { hmac, ...params } = query;

  const querystring = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  const hash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(querystring)
    .digest('hex');

  return hmac === hash;
}

async function handler(request) {
  const valid = verifyHmac(request.query);
  if (!valid)
    return {
      statusCode: 401,
      message: 'Invalid signature!',
    };

  const { shop, code } = request.query;

  try {
    const accessTokenResponse = await tiny.post({
      url: `https://${shop}/admin/oauth/access_token`,
      data: {
        code,
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
      },
    });

    const token = (request.session.token =
      accessTokenResponse.body.access_token);

    console.log(`Token acquired: ${token.slice(0, 10)}...${token.slice(-4)}`);

    return {
      statusCode: 302,
      headers: {
        location: `/dashboard?shop=${shop}`,
      },
      queryStringParameters: { shop },
    };
  } catch (error) {
    return {
      statusCode: 500,
      message: "Couldn't retrieve access token!",
      error,
    };
  }
}

module.exports = handler;
module.exports.handler = arc.http.async(handler);
