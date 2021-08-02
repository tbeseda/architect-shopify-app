const jwt = require('jsonwebtoken');

const verifyShopifyRequest = (handler) => {
  return async (req, res) => {
    const token = req.headers.authorization.replace(/Bearer /, '');

    try {
      const decoded = await jwt.verify(
        token,
        process.env.SHOPIFY_API_PRIVATE_KEY
      );

      req.sessionToken = decoded;
      req.shopDomain = decoded.dest;
      req.shopName = decoded.dest.replace('https://', '');

      return handler(req, res);
    } catch (err) {
      res.status(401).json({ message: err.message });
    }
  };
};

export default verifyShopifyRequest;
