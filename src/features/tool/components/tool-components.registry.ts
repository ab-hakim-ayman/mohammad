import type { ComponentType } from "react";
import type { Tool } from "../types/tool.types";
import { JwtDecoderTool } from "./implementations/JwtDecoderTool";
import { Base64Tool } from "./implementations/Base64Tool";
import { JsonFormatterTool } from "./implementations/JsonFormatterTool";
import { UuidGeneratorTool } from "./implementations/UuidGeneratorTool";

export interface ToolComponentProps {
  tool?: Tool;
}

export const CUSTOM_TOOL_COMPONENTS: Record<string, ComponentType<ToolComponentProps>> = {
  "jwt-decoder": JwtDecoderTool,
  "JwtDecoderTool": JwtDecoderTool,
  "base64-tool": Base64Tool,
  "Base64Tool": Base64Tool,
  "json-formatter": JsonFormatterTool,
  "JsonFormatterTool": JsonFormatterTool,
  "uuid-generator": UuidGeneratorTool,
  "UuidGeneratorTool": UuidGeneratorTool,
};
