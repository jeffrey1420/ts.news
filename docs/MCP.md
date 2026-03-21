# MCP Server Configuration

This project uses Model Context Protocol (MCP) servers to provide AI assistants with deep understanding of Nuxt and Nuxt UI.

## What is MCP?

The **Model Context Protocol (MCP)** is an open standard that enables AI assistants to connect to external tools and knowledge sources. MCP servers provide:

- **Context awareness** - AI understands Nuxt/Nuxt UI APIs, components, and best practices
- **Tool access** - AI can query documentation and provide accurate guidance
- **Consistent responses** - Answers align with official Nuxt and Nuxt UI documentation

## Configured MCP Servers

### Nuxt MCP Server
- **URL**: `https://nuxt.com/mcp`
- **Purpose**: Provides AI assistants access to Nuxt.js documentation, API references, and best practices

### Nuxt UI MCP Server  
- **URL**: `https://ui.nuxt.com/mcp`
- **Purpose**: Provides AI assistants access to Nuxt UI component library documentation

## IDE Configuration

### Cursor IDE
Add to `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "nuxt": {
      "type": "http",
      "url": "https://nuxt.com/mcp"
    },
    "nuxt-ui": {
      "type": "http",
      "url": "https://ui.nuxt.com/mcp"
    }
  }
}
```

### VS Code + GitHub Copilot
Add to `.vscode/mcp.json`:
```json
{
  "servers": {
    "nuxt": {
      "type": "http",
      "url": "https://nuxt.com/mcp"
    },
    "nuxt-ui": {
      "type": "http",
      "url": "https://ui.nuxt.com/mcp"
    }
  }
}
```

### Claude Desktop
Add to your `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "nuxt": {
      "type": "http",
      "url": "https://nuxt.com/mcp"
    },
    "nuxt-ui": {
      "type": "http",
      "url": "https://ui.nuxt.com/mcp"
    }
  }
}
```

## Benefits for AI Assistants

With these MCP servers configured, AI assistants can:

1. **Understand your codebase** - Recognize Nuxt patterns, composables, and conventions
2. **Suggest accurate APIs** - Reference correct Nuxt 3 / Nuxt UI API methods
3. **Provide contextual help** - Align with official documentation and best practices
4. **Reduce hallucinations** - Access factual information about component props and options

This is especially useful for:
- Code reviews involving Nuxt patterns
- Debugging Nuxt-specific issues  
- Onboarding new developers
- Subagent tasks that require Nuxt/Nuxt UI knowledge
