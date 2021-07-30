const crypto = require('crypto');
const begin = require('@architect/functions');
const axios = require('axios').default;

const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;

function safeCompare(stringA, stringB) {
  const lengthA = Buffer.byteLength(stringA);
  const lengthB = Buffer.byteLength(stringB);

  if (lengthA !== lengthB) return false;

  const bufferA = Buffer.alloc(lengthA, 0, 'utf8');
  const bufferB = Buffer.alloc(lengthB, 0, 'utf8');

  bufferA.write(stringA);
  bufferB.write(stringB);

  return crypto.timingSafeEqual(bufferA, bufferB);
}

function verifyHmac(query) {
  const { hmac, signature: _signature, ...map } = query;
  const orderedMap = Object.keys(map)
    .sort((v1, v2) => v1.localeCompare(v2))
    .reduce((sum, k) => {
      sum[k] = query[k];
      return sum;
    }, {});

  const message = new URLSearchParams(orderedMap).toString();
  const compute_hmac = crypto
    .createHmac('sha256', SHOPIFY_API_SECRET)
    .update(message)
    .digest('hex');

  return safeCompare(hmac, compute_hmac);
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
      `https://${shop}.myshopify.com/admin/oauth/access_token`,
      {
        code,
        client_id: SHOPIFY_API_KEY,
        client_secret: SHOPIFY_API_SECRET,
      }
    );

    req.session.accessToken = accessTokenResponse.data;

    return {
      statusCode: 302,
      headers: {
        location: `/?shop=${shop}`,
      },
      queryStringParameters: { shop },
    };
  } catch (error) {
    console.error(error);

    return {
      statusCode: 500,
      message: "Couldn't retrieve access token!",
      error,
    };
  }
}

exports.handler = begin.http.async(handler);
