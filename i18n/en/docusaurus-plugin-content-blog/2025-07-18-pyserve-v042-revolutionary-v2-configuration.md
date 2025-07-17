---
slug: pyserve-v042-revolutionary-v2-configuration
title: PyServe v0.4.2 - V2 Configuration System with Extensions
authors: [shifty]
tags: [release]
---

PyServe v0.4.2 introduces the V2 configuration system with extension support while maintaining full backward compatibility.

<!--truncate-->

## What's New in v0.4.2

### V2 Configuration System

The main feature of version 0.4.2 is the completely new V2 configuration system that opens unlimited possibilities for server configuration:

#### V2 Key Features:
- **Modular extensions** - load functionality as needed
- **Regex routing** - powerful nginx-style patterns with priorities
- **Native SPA support** - perfect for modern web applications
- **URL parameter capture** - dynamic routing with data extraction
- **External configuration modules** - organize settings in separate files
- **Full backward compatibility** - all V1 configurations work without changes

## Advanced Routing

### Regex Patterns with Priorities

The V2 system uses nginx-style routing priorities:

```yaml
version: 2

extensions:
  - type: routing
    config:
      regex_locations:
        # 1. Exact match (highest priority)
        "=/health":
          return: "200 OK"
          content_type: "application/json"
        
        # 2. Regex with parameter capture
        "~^/api/v(?P<version>\\d+)/users/(?P<id>\\d+)":
          proxy_pass: "http://user-service:3001"
          headers:
            - "API-Version: {version}"
            - "User-ID: {id}"
        
        # 3. Static files with caching
        "~*\\.(js|css|png|jpg|gif|ico|svg)$":
          root: "./static"
          cache_control: "public, max-age=31536000, immutable"
        
        # 4. SPA fallback (lowest priority)
        "__default__":
          spa_fallback: true
          root: "./dist"
          index_file: "index.html"
```

### Single Page Application (SPA) Support

PyServe now natively supports SPAs with intelligent fallback:

```yaml
"__default__":
  spa_fallback: true
  root: "./dist"
  index_file: "index.html"
  exclude_patterns:
    - "/api/"      # API requests are not redirected
    - "/admin/"    # Admin panel handled separately
```

## Microservice Architecture

### API Gateway Out of the Box

V2 transforms PyServe into a powerful API Gateway:

```yaml
version: 2

extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/users/":
          proxy_pass: "http://user-service:3001"
        "~^/api/orders/":
          proxy_pass: "http://order-service:3002"
        "~^/api/payments/":
          proxy_pass: "http://payment-service:3003"
        "=/health":
          return: "200 OK"
```

### Smart Routing with Versioning

```yaml
"~^/api/v(?P<version>\\d+)/":
  proxy_pass: "http://backend-v{version}:3000"
  headers:
    - "API-Version: {version}"
    - "X-Gateway: PyServe"
```

## Modular Architecture

### External Extensions

Organize complex configurations in separate modules:

```yaml
# config.yaml
version: 2

extensions:
  - type: security
    source: ./config/extensions/security.yaml
  
  - type: monitoring
    source: ./config/extensions/monitoring.yaml
```

```yaml
# config/extensions/security.yaml
type: security
config:
  cors:
    enabled: true
    origins: ["https://mydomain.com"]
    methods: ["GET", "POST", "PUT", "DELETE"]
  
  rate_limiting:
    enabled: true
    requests_per_minute: 60
    burst: 10
```

### Available Extensions

#### Built-in extensions:
- **Routing** - advanced routing with regular expressions
- **Security** - CORS, rate limiting, CSRF protection  
- **Caching** - Redis and memory caching
- **Monitoring** - metrics and health checks

## Production-Ready Configurations

### High-Load Server

```yaml
version: 2

server:
  host: 0.0.0.0
  port: 443
  backlog: 50

ssl:
  enabled: true
  cert_file: /etc/ssl/certs/domain.crt
  key_file: /etc/ssl/private/domain.key

extensions:
  - type: routing
    config:
      regex_locations:
        # Microservices with load balancing
        "~^/api/v(?P<version>\\d+)/users/":
          proxy_pass: "http://user-cluster:3001"
          headers:
            - "API-Version: {version}"
        
        # Aggressive static caching
        "~*\\.(js|css|png|jpg|gif|ico|svg|woff2?)$":
          root: "/var/www/static"
          cache_control: "public, max-age=31536000, immutable"
        
        # Monitoring
        "=/metrics":
          proxy_pass: "http://prometheus:9090"
  
  - type: caching
    config:
      backend: redis
      url: "redis://cache-cluster:6379"
      rules:
        "~*\\.(js|css)$": 86400  # 1 day
        "~^/api/": 300           # 5 minutes
```

## Migration Without Breaking

### Simplest Method

Add just one line to your existing configuration:

```yaml
version: 2  # <- Add this line

# All other V1 configuration works as before
server:
  host: 127.0.0.1
  port: 8000
```

### Gradual Migration

1. **Start safely** - add `version: 2`
2. **Test** - ensure everything works
3. **Migrate gradually** - move routes to extensions
4. **Add new features** - SPA, parameters, caching

## Integration with Vibe-Serving

### Hybrid Configuration

Combine static routing with AI content:

```yaml
# config.yaml (V2)
version: 2

extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/":
          proxy_pass: "http://backend:3000"
        "~*\\.(js|css|png)$":
          root: "./static"
        "__default__":
          vibe_serving: true  # AI for other content

# vibeconfig.yaml
routes:
  "/": "Create modern dashboard"
  "/reports": "Generate page with interactive reports"

settings:
  enable_v2_routing: true
  cache_ttl: 1800
```

## Performance Improvements

### Optimized Processing

- **Priority routing** - fast pattern matching
- **Smart caching** - route-level caching rules  
- **Asynchronous processing** - non-blocking operations
- **Graceful degradation** - extension fault tolerance

### Monitoring and Metrics

```yaml
extensions:
  - type: monitoring
    config:
      metrics:
        enabled: true
        endpoint: "/internal/metrics"
      health_checks:
        - path: "/internal/health"
          checks: ["database", "redis", "external_api"]
```

## Programmatic API

### Dynamic Configuration

```python
from pyserve import Configuration

# Load configuration
config = Configuration('./config.yaml')

# Add routes on the fly
config.add_route_extension({
    "~^/new-api/": {
        "proxy_pass": "http://new-service:3000"
    }
})

# Reload configuration
config.reload()
```

## Updated Documentation

- **Complete V2 guide** - all features with examples
- **Cookbook recipes** - ready solutions for common tasks
- **Migration guide** - step-by-step migration from V1
- **Best practices** - production recommendations

## Conclusion

PyServe v0.4.2 is a major step towards the full release. Combining ease of use with flexibility while maintaining the "works out of the box" philosophy.

### Useful Links:

- [V2 Configuration Documentation](https://docs.pyserve.org/docs/installation-and-setup/configuration)

---
