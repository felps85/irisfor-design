# Full Masking With Cloudflare

This repo already supports a fully masked public install experience, but GitHub Pages alone cannot proxy live backend routes.

To fully mask the install/runtime layer behind `https://www.irisfor.design/`, use Cloudflare in front of the current public site and backend.

## What this setup does

- keeps the public website on `www.irisfor.design`
- keeps user-facing install copy on Iris-owned URLs only
- proxies live backend traffic without exposing Supabase URLs in the public install flow

## Required public routes

- `https://www.irisfor.design/mcp`
  - proxies to `https://rfgulhwmpedzafgrasar.supabase.co/functions/v1/remote-mcp`
- `https://www.irisfor.design/api/*`
  - proxies to `https://rfgulhwmpedzafgrasar.supabase.co/functions/v1/*`
- `https://www.irisfor.design/auth/*`
  - proxies to `https://rfgulhwmpedzafgrasar.supabase.co/auth/*`

## Why Cloudflare Routes

The public site origin is external to Cloudflare, so Cloudflare recommends a Worker Route in front of an existing proxied hostname for this kind of setup.

Official references:
- [Cloudflare Routes](https://developers.cloudflare.com/workers/configuration/routing/routes/)
- [Cloudflare Routes and domains](https://developers.cloudflare.com/workers/configuration/routing/)
- [Cloudflare nameservers](https://developers.cloudflare.com/dns/nameservers/update-nameservers/)

## Files in this repo

- `worker/index.js`
- `wrangler.jsonc`
- `public/config.masked.example.js`

## Cutover sequence

1. Put `irisfor.design` on Cloudflare and update the nameservers at Namecheap.
2. In Cloudflare DNS:
   - create proxied `CNAME` `www -> felps85.github.io`
3. Deploy the Worker in this repo:
   - `npm install`
   - `npm run proxy:deploy`
4. Copy `public/config.masked.example.js` over `public/config.js`
5. Push the updated site config so the live site starts using:
   - `https://www.irisfor.design/mcp`
   - `https://www.irisfor.design/api`
   - `https://www.irisfor.design/auth`
6. Set the backend secret:
   - `PUBLIC_IRIS_CONNECTION_URL=https://www.irisfor.design/mcp`
7. Redeploy:
   - `remote-mcp`
   - `create-mcp-token`

## Important truth

Until the Cloudflare Worker is live and the public config is switched to the masked values, the runtime layer is still backend-terminated even if the website itself is on `www.irisfor.design`.
