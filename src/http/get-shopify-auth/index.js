const crypto = require('crypto');
const begin = require('@architect/functions');

async function handler(request) {
  const { query } = request;
  const key = process.env.SHOPIFY_API_PUBLIC_KEY;
  const scopes = process.env.SHOPIFY_AUTH_SCOPES;
  const redirectUri = process.env.SHOPIFY_AUTH_CALLBACK_URL;
  const nonce = crypto.randomBytes(16).toString('base64');

  if (!query.shop)
    return {
      statusCode: 401,
      message: 'shop query parameter required',
    };

  const authUrl = `https://${query.shop}/admin/oauth/authorize?client_id=${key}&scope=${scopes}&redirect_uri=${redirectUri}&state=${nonce}`;

  return {
    statusCode: 302,
    headers: {
      location: authUrl,
    },
  };
}

exports.handler = begin.http.async(handler);
