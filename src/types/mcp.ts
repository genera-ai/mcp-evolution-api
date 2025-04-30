/**
 * Tipos básicos para implementação do protocolo MCP (Model Context Protocol)
 */

// Tipos para ferramentas
export interface MCPToolParameter {
  type: string;
  description?: string;
  items?: any;
  properties?: Record<string, MCPToolParameter>;
  required?: string[];
}

export interface MCPToolParameters {
  type: string;
  properties?: Record<string, MCPToolParameter>;
  required?: string[];
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: MCPToolParameters;
  handler: (args: any) => Promise<any>;
}

// Tipos para recursos
export interface MCPResource {
  description: string;
  [key: string]: any;
}

// Tipos para prompts
export interface MCPPrompt {
  name: string;
  description: string;
  prompt: string;
  inputSchema: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

// Tipos para configuração do servidor
export interface MCPServerConfig {
  title: string;
  description: string;
  version: string;
  auth?: any;
}

// Tipos para requisições e respostas
export interface MCPInitializeRequest {
  protocol: {
    version: string;
  };
}

export interface MCPInitializeResponse {
  protocol: {
    version: string;
  };
  server: {
    title: string;
    description: string;
    version: string;
  };
}

export interface MCPListResourcesResponse {
  resources: Record<string, MCPResource>;
}

export interface MCPListToolsResponse {
  tools: MCPTool[];
}

export interface MCPListPromptsResponse {
  prompts: Record<string, MCPPrompt>;
}

export interface MCPToolRequest {
  name: string;
  parameters: Record<string, any>;
}

export interface MCPToolResponse {
  result: any;
} 