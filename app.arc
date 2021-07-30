@app
shopify-admin-app

@static
folder public

@http
get /shopify/auth
post /shopify/auth/callback

@tables
data
  scopeID *String
  dataID **String
  ttl TTL
