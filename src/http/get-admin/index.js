const verifyShopifyRequest = require('@architect/shared/verifyShopifyRequest');

exports.handler = async function http(req) {
  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8',
    },
    body: `
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopify App</title>
  <script src="https://unpkg.com/@shopify/app-bridge@2"></script>
  <script>
    var AppBridge = window['app-bridge'];
    var searchParams = new URLSearchParams(window.location.search);
    var shopOrigin = searchParams.get('shop');

    var app = AppBridge.createApp({
      apiKey: '${process.env.SHOPIFY_API_KEY}',
      shopOrigin: shopOrigin
    });

    AppBridge.actions.Toast
      .create(
        app,
        {
          message: 'App Bridge Connected',
          duration: 5000,
        }
      )
      .dispatch(AppBridge.actions.Toast.Action.SHOW);
  </script>
</head>

<body>
  <h1>Shopify App</h1>
</body>

</html>
`,
  };
};
