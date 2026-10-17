import { McpServer } from "@modelcontextprotocol/server";
import { createMcpHandler } from "agents/mcp/server";
import { z } from "zod";

const DATA_BASE = "https://aidarknet.pages.dev/api";

async function fetchJson(path: string) {
	const res = await fetch(`${DATA_BASE}/${path}`);
	if (!res.ok) throw new Error(`fetch ${path} failed: ${res.status}`);
	return res.json();
}

function createServer() {
	const server = new McpServer({
		name: "AIDarknet",
		version: "1.0.0",
	});

	server.registerTool(
		"get_ai_prices",
		{
			description: "Get current AI subscription prices (ChatGPT, Claude, Gemini, etc.). Prices in USD, verified against official pricing pages.",
			inputSchema: z.object({
				product: z.string().optional().describe("Filter by product name, e.g. 'Claude', 'ChatGPT', 'Gemini'. Omit for all."),
			}),
		},
		async ({ product }) => {
			const data: any = await fetchJson("prices.json");
			let products = data.products;
			if (product) {
				products = products.filter((p: any) =>
					p.name.toLowerCase().includes(product.toLowerCase())
				);
			}
			return { content: [{ type: "text", text: JSON.stringify({ updated: data._meta.updated, products }, null, 2) }] };
		},
	);

	server.registerTool(
		"get_free_credits",
		{
			description: "Get currently available free AI credits, trials and limited-time offers (including China-exclusive: StepFun, Doubao, Tencent Hunyuan).",
			inputSchema: z.object({}),
		},
		async () => {
			const data: any = await fetchJson("free.json");
			return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
		},
	);

	server.registerTool(
		"get_free_models",
		{
			description: "Get list of free LLM API models (OpenRouter free tier) with context length and tool-calling support.",
			inputSchema: z.object({
				tools_only: z.boolean().optional().describe("Only return models with tool-calling support."),
				min_context: z.number().optional().describe("Minimum context length in tokens."),
			}),
		},
		async ({ tools_only, min_context }) => {
			const data: any = await fetchJson("models.json");
			let models = data.models;
			if (tools_only) models = models.filter((m: any) => m.tools);
			if (min_context) models = models.filter((m: any) => m.context_length >= min_context);
			return { content: [{ type: "text", text: JSON.stringify({ date: data.date, count: models.length, models }, null, 2) }] };
		},
	);

	server.registerTool(
		"get_china_ai",
		{
			description: "China-exclusive: Chinese AI products pricing and free tiers (Doubao, Kimi, Qwen, ERNIE, StepFun, Hunyuan). In CNY.",
			inputSchema: z.object({}),
		},
		async () => {
			const data: any = await fetchJson("china-ai.json");
			return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
		},
	);

	server.registerTool(
		"get_api_pricing",
		{
			description: "Pay-as-you-go LLM API pricing per 1M tokens (DeepSeek, Claude, GPT, Gemini).",
			inputSchema: z.object({}),
		},
		async () => {
			const data: any = await fetchJson("api-pricing.json");
			return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
		},
	);

	server.registerTool(
		"get_subscription_guide",
		{
			description: "Decision guide: which AI subscription for which use case (coding, writing, free, China users).",
			inputSchema: z.object({}),
		},
		async () => {
			const data: any = await fetchJson("guides.json");
			return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
		},
	);

	return server;
}

const handler = createMcpHandler(createServer);

export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		return handler(request, env, ctx);
	},
} satisfies ExportedHandler<Env>;
