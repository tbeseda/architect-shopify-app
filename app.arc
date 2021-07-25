@app
shopify-admin-app

@static

@http
post /shopify/auth

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
