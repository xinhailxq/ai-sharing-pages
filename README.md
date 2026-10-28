# AI Sharing Pages

Public website repository for selected AI Sharing topics.

## Languages

The site is published in three languages:

- Simplified Chinese: `/`
- Traditional Chinese: `/zh-tw/`
- English: `/en/`

Landing pages and Topic 01 have three language editions with language switching. Topic 02 currently has a Simplified Chinese edition only; all three landing pages link to that edition and clearly indicate the language. Topic 02 has its own canonical URL.

## Published content

### Landing pages

- [`index.html`](./index.html) — Simplified Chinese.
- [`zh-tw/index.html`](./zh-tw/index.html) — Traditional Chinese.
- [`en/index.html`](./en/index.html) — English.

### Chat, Work, and Codex guide

- [`chatgpt-features-chat-work-codex/index.html`](./chatgpt-features-chat-work-codex/index.html) — Simplified Chinese.
- [`zh-tw/chatgpt-features-chat-work-codex/index.html`](./zh-tw/chatgpt-features-chat-work-codex/index.html) — Traditional Chinese.
- [`en/chatgpt-features-chat-work-codex/index.html`](./en/chatgpt-features-chat-work-codex/index.html) — English.

### Topic 02 — Understanding MCP (Simplified Chinese)

- [`mcp-understanding/index.html`](./mcp-understanding/index.html) — interactive conceptual guide; tool-call replay is clearly labeled as offline simulated data.
- `assets/mcp-topic.css`, `assets/mcp-topic.js` — dedicated styles and deterministic offline interactions.
- The source speaker notes and validators remain private in `xinhailxq/ai-sharing`.

## Shared assets

- `assets/landing.css` — landing-page design.
- `assets/topic.css` — interactive guide design.
- `assets/app.js` — shared renderer and interactions.
- `assets/content-zh-cn.js` — Simplified Chinese content.
- `assets/content-zh-tw.js` — Traditional Chinese content.
- `assets/content-en.js` — English content.

## GitHub Pages

Publish from:

- Branch: `main`
- Folder: `/(root)`

Public URLs:

- `https://xinhailxq.github.io/ai-sharing-pages/`
- `https://xinhailxq.github.io/ai-sharing-pages/zh-tw/`
- `https://xinhailxq.github.io/ai-sharing-pages/en/`
- `https://xinhailxq.github.io/ai-sharing-pages/mcp-understanding/` (Simplified Chinese only)

This repository only contains material intended for public access. Source documents, drafts, presentation builders, and HyperFrames source files remain in the private `ai-sharing` repository.

## Topic 02 v3 — From MCP to Reliable Agents (2026-10-27)

- [Interactive v3: MCP to Reliable Agents](./mcp-understanding/v3/index.html) — Simplified Chinese, responsive static Mission Control teaching website.
- Public assets: `assets/mcp-v3.css`, `assets/mcp-v3.js`. Existing Topic 02 v2 remains available separately at `/mcp-understanding/`.
- The homepage provides a translated v3 entry in zh-CN / zh-TW / en; the v3 article is currently Simplified Chinese.
- FrameFlow Studio is fictional; every tool response, job, asset, approval, and graph state is a deterministic offline teaching simulation. **Not a live MCP call or real production workflow.**
- Public URL: `https://xinhailxq.github.io/ai-sharing-pages/mcp-understanding/v3/`.
- The full research archive, speaker notes, development readme, and validators remain exclusively in private `xinhailxq/ai-sharing`.

## Topic 02 v3 — Multilingual editions (2026-10-28)

The complete interactive Topic 02 v3 experience is available in three languages:

- [简体中文](./mcp-understanding/v3/index.html) — `/mcp-understanding/v3/`
- [繁體中文](./zh-tw/mcp-understanding/v3/index.html) — `/zh-tw/mcp-understanding/v3/`
- [English](./en/mcp-understanding/v3/index.html) — `/en/mcp-understanding/v3/`

All three pages share `assets/mcp-v3.js` and `assets/mcp-v3.css`. Localized dynamic feedback is supplied by `assets/mcp-v3-en-locale.js` and `assets/mcp-v3-zh-tw-locale.js`. Each homepage entry and in-page language selector points to the relevant edition.

The FrameFlow Studio scenario, actions, synthetic receipts and approvals remain **SIMULATED / OFFLINE**. Topic 02 v2 is unchanged. Full research, private speaker notes and validators remain in the private source repository.
