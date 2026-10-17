# AIDarknet MCP Server

A remote [MCP](https://modelcontextprotocol.io/) server that gives AI agents what they're always missing: **fresh, structured AI market data** — subscription prices, free credits, free LLM models, and China-exclusive AI pricing. No training-data cutoff problem: data is refreshed daily.

**Live server (authless, Streamable HTTP):**

```
https://aidarknet-mcp.fangzimo168.workers.dev/mcp
```

Data hub: [https://aidarknet.pages.dev](https://aidarknet.pages.dev) — plain JSON APIs, `llms.txt`, and agent discovery (`/.well-known/ard.json`).

## Tools

| Tool | Description |
|---|---|
| `get_ai_prices` | AI subscription prices (ChatGPT, Claude, Gemini…). Prices in USD, verified against official pricing pages. Optional `product` filter. |
| `get_free_credits` | Currently available free AI credits, trials and limited-time offers (including China-exclusive: StepFun, Doubao, Tencent Hunyuan). |
| `get_free_models` | Free LLM API models (OpenRouter free tier) with context length and tool-calling support. Filters: `tools_only`, `min_context`. |
| `get_china_ai` | **China-exclusive**: Chinese AI product pricing and free tiers (Doubao, Kimi, Qwen, ERNIE, StepFun, Hunyuan). Prices in CNY. No English source has this. |
| `get_api_pricing` | Pay-as-you-go LLM API pricing per 1M tokens (DeepSeek, Claude, GPT, Gemini). |
| `get_subscription_guide` | Decision guide: which AI subscription for which use case (coding, writing, free tier, China users). |

## Try it

```bash
curl https://aidarknet.pages.dev/api/prices.json | head -c 500
```

Or connect from Claude Desktop / any MCP client via the `mcp-remote` proxy:

```json
{
  "mcpServers": {
    "aidarknet": {
      "command": "npx",
      "args": ["mcp-remote", "https://aidarknet-mcp.fangzimo168.workers.dev/mcp"]
    }
  }
}
```

## Run your own

Deployed on [Cloudflare Workers](https://workers.cloudflare.com/) (free tier). Based on the [`remote-mcp-authless`](https://github.com/cloudflare/ai/tree/main/demos/remote-mcp-authless) template.

```bash
npm install
npm run dev        # local dev
npm run deploy     # deploy to your own workers.dev
```

The server is stateless — it just proxies the JSON data feeds from `https://aidarknet.pages.dev/api`. Point `DATA_BASE` in `src/index.ts` at your own data source to run it against custom data.

## Data

All data feeds are refreshed daily and released under **CC0** (public domain) — use them however you like, no attribution required:

- `prices.json` — AI subscription prices
- `free.json` — free credits / trials / limited offers
- `models.json` — free LLM models
- `china-ai.json` — Chinese AI pricing (bilingual)
- `api-pricing.json` — per-token API pricing
- `guides.json` — subscription decision guides

## License

Code: [MIT](LICENSE). Data: CC0.
