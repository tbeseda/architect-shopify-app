const crypto = require('crypto');
const begin = require('@architect/functions');
const axios = require('axios').default;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;

function verifyHmac(query) {
  const { hmac, ...params } = query;

  const message = Object.keys(params)
    .map((key) => `${key}=${params[key]}`)
    .join('&');

  const hash = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');

  return hmac === hash;
}

async function handler(req) {
  const valid = verifyHmac(req.query);
  if (!valid)
    return {
      statusCode: 401,
      message: 'Invalid signature!',
    };

  const { shop, code } = req.query;

  try {
    const accessTokenResponse = await axios.post(
      `https://${shop}/admin/oauth/access_token`,
      {
        code,
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
      }
    );

    const token = (req.session.accessToken =
      accessTokenResponse.data.access_token);
    console.log(`Token acquired: ${token.slice(0, 10)}...${token.slice(-4)}`);

    return {
      statusCode: 302,
      headers: {
        location: `/admin?shop=${shop}`,
      },
      queryStringParameters: { shop },
    };
  } catch (error) {
    console.error(error.reason);

    return {
      statusCode: 500,
      message: "Couldn't retrieve access token!",
      error,
    };
  }
}

exports.handler = begin.http.async(handler);
