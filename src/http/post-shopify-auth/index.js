let begin = require('@architect/functions')

async function handler (req) {
  // Log session state
  console.log(req.session)
  // ... and render it in a browser
  let body = `
    <h1>Session state</h1>
    <pre>${JSON.stringify(req.session, null, 2)}</pre>
  `
  return {
    statusCode: 200,
    body
  }
}

exports.handler = begin.http.async(handler)
