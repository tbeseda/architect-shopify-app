const jwt = require('jsonwebtoken');

async function verifyShopifyRequest(request) {
  const token = request.headers.authorization.replace(/Bearer /, '');

  try {
    const decoded = jwt.verify(token, process.env.SHOPIFY_API_SECRET);

    request.session.sessionToken = decoded;
    request.session.shopDomain = decoded.dest;
    request.session.shopName = decoded.dest.replace('https://', '');

    return request;
  } catch (err) {
    return { status: 401, message: err.message };
  }
}

module.exports = verifyShopifyRequest;
