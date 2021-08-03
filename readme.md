# Serverless Shopify App on Architect

> An embedded Shopify admin application you can build locally and deploy to AWS with [Architect](https://arc.codes).

## What you get

- [Merchant OAuth](https://shopify.dev/apps/auth/oauth) with permanent access token retrieval
- [Shopify App Bridge Connection](https://shopify.dev/apps/tools/app-bridge)
- [Session token validation via App Bridge](https://shopify.dev/apps/auth/session-tokens/app-bridge-utilities)
- [Shopify CLI](https://shopify.dev/apps/tools/cli) compatibility (wrapped around [`@architect/sandbox`]())

## Not included

- React, [Polaris](https://polaris.shopify.com/), or any front end tooling
- a datastore connection (though, that's easy with `arc`)
- Rails
- actual batteries 🔋

## Status: WIP

![waiting](https://media2.giphy.com/media/QBd2kLB5qDmysEXre9/giphy.gif?cid=ecf05e4759gmw5ms70lsc0is02sap3wnfybobidow8imst91&rid=giphy.gif&ct=g)

## Next Steps

- /api/ping should connect to Shopify Admin API with [the official Node client](https://github.com/Shopify/shopify-node-api) and return results
- test session validation
- document:
  - why this approach
  - getting set up locally
    - Shopify CLI + `arc`
  - adding `arc` resources
    - @http + @events would help demonstrate how to handle webhooks
  - deploying (probably out of scope)

## Getting started

### Required

- knowledge of Node.js and Architect (or at least what "serverless" is)
- from Shopify
  - partner account
  - development store
  - admin app credentials
  - CLI installed

### Building locally 🏗️

- clone
- configure `.shopify-cli.yml`
- `shopify node connect`
- `npm i`
- `npm test`
- `shopify node serve` runs `npm start` and provides a tunnel
- install the app to the dev store
- do work

## Reference

- [Shopify Apps](https://shopify.dev/apps)
- [Architect](https://arc.codes)
