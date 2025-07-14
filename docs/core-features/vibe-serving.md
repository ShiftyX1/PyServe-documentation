---
sidebar_position: 5
---

# Vibe-Serving

AI-Generated Content Mode for Dynamic Web Pages

## What is Vibe-Serving?

Vibe-Serving is a unique feature of PyServe that allows you to generate web pages dynamically using AI language models. Instead of serving static files, PyServe can generate content on-the-fly based on prompts you configure for different routes.

:::info How it works
1. A user visits a URL (e.g., `/about`)
2. PyServe looks up the configured prompt for that route
3. The prompt is sent to an AI model (OpenAI, Claude, etc.)
4. The AI generates a complete HTML page
5. The page is cached and served to the user
:::

## Configuration

Vibe-Serving is configured through a separate `vibeconfig.yaml` file:

```yaml
routes:
  "/": "Generate a beautiful home page for PyServe. Use HTML and CSS."
  "/about": "Generate an 'About Us' page for PyServe. Briefly describe the project."
  "/contact": "Create a contact page with a feedback form."

settings:
  cache_ttl: 3600              # Cache time in seconds
  model: "claude-3.5-sonnet"   # AI model to use
  timeout: 3600                # Request timeout in seconds
  api_url: "https://bothub.chat/api/v2/openai/v1"  # Custom API endpoint
  fallback_enabled: true       # Enable fallback to error page
```

### Environment Variables

You need to set up environment variables for AI API access. Create a `.env` file:

```bash
OPENAI_API_KEY=your_api_key_here
```

## Starting Vibe-Serving

To enable Vibe-Serving mode, use the `--vibe-serving` flag:

```bash
python run.py --vibe-serving
```

This will start PyServe in a special mode where it generates content using AI instead of serving static files.

:::warning Important
Make sure you have configured your AI API credentials and have sufficient API quota, as each page generation requires an API call (unless cached).
:::

## Supported AI Models

Vibe-Serving supports various AI models through OpenAI-compatible APIs:

| Model | Provider | Configuration |
|-------|----------|---------------|
| `gpt-3.5-turbo` | OpenAI | Default OpenAI API |
| `gpt-4` | OpenAI | Default OpenAI API |
| `claude-3.5-sonnet` | Anthropic (via proxy) | Custom `api_url` required |
| Local models | Ollama, etc. | Custom `api_url` required |

## Advanced Configuration

### Custom API Endpoints

For using alternative providers or local models:

```yaml
settings:
  api_url: "http://localhost:11434/v1"  # Ollama
  model: "llama2"
```

### Route-Specific Settings

You can configure different models or settings for specific routes:

```yaml
routes:
  "/":
    prompt: "Create a modern landing page for PyServe"
    model: "gpt-4"
    cache_ttl: 7200
  "/docs":
    prompt: "Generate comprehensive documentation"
    model: "claude-3.5-sonnet"
    cache_ttl: 3600
```

### Caching Configuration

Control how generated content is cached:

```yaml
settings:
  cache_ttl: 3600        # Default cache time
  cache_enabled: true    # Enable/disable caching
  cache_dir: "./cache"   # Cache directory
```

## Prompt Engineering

### Best Practices

1. **Be specific**: Include detailed instructions about the desired output format
2. **Set context**: Provide information about PyServe and its purpose
3. **Include styling**: Specify CSS requirements for consistent design
4. **Define structure**: Outline the expected HTML structure

### Example Prompts

**Landing Page:**
```yaml
"/": |
  Create a modern, responsive landing page for PyServe, a Python HTTP server.
  
  Requirements:
  - Clean, professional design
  - Include a hero section with the PyServe logo
  - Feature highlights: Fast, Lightweight, Easy to use
  - Call-to-action button linking to /docs
  - Use modern CSS with flexbox/grid
  - Include a dark/light theme toggle
  - Mobile-responsive design
```

**Documentation Page:**
```yaml
"/docs": |
  Generate a comprehensive documentation page for PyServe.
  
  Include:
  - Table of contents
  - Installation instructions
  - Basic usage examples
  - Configuration options
  - Code examples with syntax highlighting
  - Navigation links to other sections
```

## Error Handling

### Fallback Pages

Configure fallback behavior when AI generation fails:

```yaml
settings:
  fallback_enabled: true
  fallback_page: "./static/error.html"
  fallback_message: "Content temporarily unavailable"
```

### Timeout Handling

Set appropriate timeouts for AI requests:

```yaml
settings:
  timeout: 30          # 30 seconds timeout
  retry_attempts: 3    # Number of retry attempts
  retry_delay: 5       # Delay between retries (seconds)
```

## Performance Optimization

### Caching Strategy

1. **Aggressive caching**: Set long cache times for stable content
2. **Selective regeneration**: Use shorter cache times for dynamic content
3. **Manual cache invalidation**: Clear cache when needed

```bash
# Clear all cache
python run.py --clear-cache

# Clear specific route cache
python run.py --clear-cache /about
```

### Pre-generation

Generate content in advance for better performance:

```bash
# Pre-generate all configured routes
python run.py --vibe-serving --pre-generate

# Pre-generate specific routes
python run.py --vibe-serving --pre-generate /home /about
```

## Security Considerations

### API Key Protection

1. Never commit API keys to version control
2. Use environment variables or secure key management
3. Rotate keys regularly
4. Monitor API usage for unusual activity

### Content Filtering

Implement content filtering to ensure appropriate output:

```yaml
settings:
  content_filter: true
  blocked_keywords: ["inappropriate", "harmful"]
  max_content_length: 50000  # Maximum generated content length
```

### Rate Limiting

Protect against abuse with rate limiting:

```yaml
settings:
  rate_limit: 10          # Requests per minute per IP
  burst_limit: 5          # Burst allowance
  cooldown_period: 300    # Cooldown period in seconds
```

## Monitoring and Logging

### AI Request Logging

Enable detailed logging for AI requests:

```yaml
logging:
  level: INFO
  ai_requests: true
  cache_hits: true
  generation_time: true
```

### Metrics Collection

Track important metrics:

- Generation success rate
- Average response time
- Cache hit ratio
- API costs
- User satisfaction

## Troubleshooting

### Common Issues

**API Key Not Working:**
```bash
# Test API key
python run.py --test-api-key
```

**Generation Timeout:**
```yaml
settings:
  timeout: 60  # Increase timeout
```

**Cache Issues:**
```bash
# Clear and rebuild cache
python run.py --clear-cache --pre-generate
```

**Model Not Available:**
```yaml
settings:
  model: "gpt-3.5-turbo"  # Use alternative model
```

## Best Practices

1. **Start Simple**: Begin with basic prompts and gradually add complexity
2. **Test Thoroughly**: Test all routes before deploying
3. **Monitor Costs**: Keep track of AI API usage and costs
4. **Cache Strategically**: Balance freshness with performance
5. **Have Fallbacks**: Always provide fallback content for failures
6. **Optimize Prompts**: Refine prompts based on output quality
7. **Security First**: Implement proper security measures from the start

## Integration Examples

### E-commerce Site

```yaml
routes:
  "/": "Create a modern e-commerce homepage with product showcase"
  "/products": "Generate a product listing page with filtering options"
  "/product/{id}": "Create a detailed product page for item {id}"
```

### Blog Platform

```yaml
routes:
  "/": "Generate a blog homepage with recent posts"
  "/post/{slug}": "Create a blog post page for '{slug}'"
  "/category/{name}": "Generate category page for '{name}'"
```

### Portfolio Site

```yaml
routes:
  "/": "Create a personal portfolio homepage"
  "/portfolio": "Generate a portfolio gallery page"
  "/contact": "Create a professional contact page with form"
```
