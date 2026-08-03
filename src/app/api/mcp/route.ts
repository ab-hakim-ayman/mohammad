import { NextResponse } from "next/server";

// ১. MCP রিকোয়েস্ট বডির জন্য টাইপ ডিফিনিশন (JSON-RPC স্ট্যান্ডার্ড অনুযায়ী)
type McpRequest = {
    jsonrpc?: string;
    id?: string | number;
    method?: string;
    params?: Record<string, any>;
};

// ২. MCP রিসোর্সের জন্য টাইপ ডিফিনিশন
type McpResource = {
    uri: string;
    name: string;
    mimeType: string;
    description: string;
    data?: any;
};

// ৩. GET মেথড: সার্ভার ইনফো এবং রিসোর্স লিস্ট রিটার্ন করবে
export async function GET(): Promise<NextResponse> {
    // আপনি চাইলে এখানে আপনার প্রিজমা বা ডাটাবেজ থেকে রিয়েল ডেটা ফেচ করতে পারেন

    const mcpData = {
        protocolVersion: "2024-11-05",
        serverInfo: {
            name: "hafiq-portfolio-mcp-server",
            version: "1.0.0",
        },
        capabilities: {
            resources: {},
            tools: {},
        },
        resources: [
            {
                uri: "portfolio://about",
                name: "About Me",
                mimeType: "application/json",
                description: "Professional background and bio of the developer.",
            },
            {
                uri: "portfolio://projects",
                name: "Projects Roster",
                mimeType: "application/json",
                description: "List of full-stack projects and web applications built.",
            },
        ] as McpResource[],
    };

    return NextResponse.json(mcpData);
}

// ৪. POST মেথড: এআই বা ক্লায়েন্টের রিকোয়েস্ট হ্যান্ডেল করবে টাইপ সেফটি সহ
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body: McpRequest = await request.json();

        // এখানে এআই বা ক্লায়েন্টের পাঠানো মেথড (method) চেক করে রেসপন্স দিতে পারেন
        const method = body.method || "unknown";

        return NextResponse.json({
            jsonrpc: "2.0",
            id: body.id || 1,
            result: {
                message: `MCP request for method '${method}' processed successfully.`,
                receivedParams: body.params || {},
            },
        });
    } catch (error) {
        return NextResponse.json(
            {
                jsonrpc: "2.0",
                error: {
                    code: -32700,
                    message: "Invalid JSON or MCP Request format",
                },
                id: null,
            },
            { status: 400 }
        );
    }
}