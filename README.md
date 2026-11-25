# suby

Free subtitle generator for creators, built for accessibility and SEO. Drop in a video and get SRT, VTT or TXT captions.

Transcription runs in the browser with Whisper ([transformers.js](https://github.com/huggingface/transformers.js)). It uses WebGPU when available and falls back to WASM. There is no backend and no per-minute API cost, and video never leaves the user's device.

## Run

Any static file server works; module workers don't load over `file://`.

```bash
python3 -m http.server 8000 --directory public
```

## Files

- `public/index.html`: landing page and app UI
- `public/worker.js`: Whisper pipeline (off the main thread)
- `public/format.js`: SRT, VTT and TXT writers
- `wrangler.jsonc`: Cloudflare Workers static-assets config (`npx wrangler deploy`)
- `public/credits.js`: Gumroad credit checks (config at the top)

## Payments ($5 credit packs, no backend)

Gumroad sells license keys and counts each key's uses, so no server is needed.

1. On Gumroad, create a $5 product and turn on **Generate a unique license key per sale**.
2. In `public/credits.js`, set `productId` (shown under the license key setting) and `buyUrl` (your product link).
3. Deploy. Until `productId` is set, the tool stays free.

Each browser gets 3 free videos. A paid key allows 20 successful videos; failed runs cost nothing.
Limit: checks run in the browser, so a technical user could bypass them.

Tests: `node format.test.mjs && node credits.test.mjs`
