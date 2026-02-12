/**
 * Local type definitions for OpenClaw plugin integration
 * These match the @openclaw/plugin-sdk interface for compatibility
 */

export interface ToolError {
  message: string;
  code?: string;
}

export interface ToolSuccessResult {
  type: 'success';
  text: string;
}

export interface ToolErrorResult {
  type: 'error';
  error: ToolError;
}

export type ToolResult = ToolSuccessResult | ToolErrorResult;

export interface ToolInput {
  args: Record<string, unknown>;
  context: ToolContext;
}

export interface ToolContext {
  sessionId?: string;
  userId?: string;
  channelId?: string;
  [key: string]: unknown;
}

export interface AgentTool {
  name: string;
  description: string;
  parameters: unknown; // TypeBox schema
  execute: (input: ToolInput) => Promise<ToolResult>;
}

export interface PluginApi {
  registerTool: (tool: AgentTool) => void;
  registerGatewayMethod?: (method: string, handler: Function) => void;
  registerHttpRoute?: (path: string, handler: Function) => void;
}
