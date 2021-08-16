const arc = require('@architect/functions');
const { html } = require('common-tags');

async function handler() {
  const body = html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
        <title>Shopify App</title>
        <script src="https://unpkg.com/@shopify/app-bridge@2"></script>
        <script src="https://unpkg.com/@shopify/app-bridge-utils@2"></script>
        <script src="https://unpkg.com/axios@0.2.1/dist/axios.min.js"></script>
        <script>
          (async function () {
            var AppBridge = window['app-bridge'];
            var AppBridgeUtils = window['app-bridge-utils'];
            var searchParams = new URLSearchParams(window.location.search);
            var shopOrigin = searchParams.get('shop');

            var app = AppBridge.createApp({
              apiKey: '${process.env.SHOPIFY_API_KEY}',
              shopOrigin: shopOrigin,
            });

            AppBridge.actions.Toast.create(app, {
              message: 'App Bridge Connected',
              duration: 5000,
            }).dispatch(AppBridge.actions.Toast.Action.SHOW);

            var token = await AppBridgeUtils.getSessionToken(app);

            var test = await axios({
              url: '/api/test',
              headers: {
                Authorization: 'Bearer ' + token,
              },
            });

            console.log(test);
          })();
        </script>
      </head>

      <body>
        <header>
          <h1>Shopify App</h1>
        </header>
        <main>
          <section></section>
        </main>
      </body>
    </html>
  `;

  return {
    statusCode: 200,
    headers: {
      'content-type': 'text/html; charset=utf8',
    },
    body,
  };
}

module.exports = handler;
module.exports.handler = arc.http.async(handler);
