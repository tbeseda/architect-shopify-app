const arc = require('@architect/functions');

const verifyShopifyRequest = require('@architect/shared/verifyShopifyRequest');

async function handler(request) {
  console.log(`Verified session for ${request.session.shopName}`);
  return { json: { success: true } };
}

exports.handler = arc.http.async(verifyShopifyRequest, handler);
