# Iris Public Site

Public website for Iris at `https://www.irisfor.design/`.

This repo is intentionally public and limited to the website surface:
- public marketing and install pages
- browser-safe configuration
- branding assets for the public site

This repo does not include:
- private app logic
- Supabase functions
- MCP server implementation
- internal docs or non-public product code

Current truth:
- GitHub Pages hosts the public information site
- the live install/runtime layer still terminates on the backend origin until an external proxy layer exists
- user-facing copy should prefer `Iris connection URL` over backend/vendor wording

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```
