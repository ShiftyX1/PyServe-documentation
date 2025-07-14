---
sidebar_position: 4
---

# Reverse Proxy

Learn how to configure and use PyServe's reverse proxy capabilities for both HTTP and WebSocket

## Overview

PyServe's reverse proxy feature allows you to forward requests to other servers. It supports both HTTP and WebSocket protocols, making it perfect for:

- Load balancing
- API gateway implementation
- WebSocket proxying
- Protocol translation
- SSL/TLS termination

## Configuration

Reverse proxy settings are configured in the `reverse_proxy` section of your `config.yaml` file. You can define multiple proxy rules for different paths.

```yaml
server:
  reverse_proxy:
    - host: localhost      # Backend server host
      path: /api          # Path to proxy
      port: 3000         # Backend server port
      ssl: false         # Backend SSL/TLS
      
    - host: localhost
      path: /ws
      port: 8080
      ssl: false         # Backend SSL/TLS
      
    - host: example.com
      path: /socket.io
      port: 443
      ssl: true          # Use SSL for backend connection
```

:::info
**WebSocket Support:** WebSocket connections are automatically detected by headers and do not require special configuration. All proxy configurations support both HTTP and WebSocket protocols.
:::

### Configuration Options

| Option | Type | Description | Default |
|--------|------|-------------|---------|
| `host` | string | Backend server hostname or IP | localhost |
| `path` | string | Path prefix to proxy | / |
| `port` | integer | Backend server port | 80 |
| `ssl` | boolean | Use SSL/TLS for backend connection | false |

:::info
**Note:** The `websocket` parameter has been removed in favor of automatic WebSocket detection via request headers.
:::

## HTTP Proxying

For regular HTTP requests, the proxy forwards all headers, methods, and body content to the backend server. The response from the backend is then returned to the client.

```yaml
# Example HTTP proxy configuration
server:
  reverse_proxy:
    - host: api.internal
      path: /api
      port: 8000
      websocket: false
```

This configuration will:
- Forward all requests from `/api/*` to `http://api.internal:8000/*`
- Preserve HTTP methods (GET, POST, etc.)
- Forward request headers and body
- Return backend response to client

## WebSocket Proxying

PyServe supports WebSocket proxying with automatic protocol upgrade handling and bidirectional data streaming.

```yaml
# Example WebSocket proxy configuration
server:
  reverse_proxy:
    - host: ws.example.com
      path: /ws
      port: 8080
      websocket: true
      ssl: false
```

### WebSocket Features

- Automatic WebSocket upgrade handling
- Full support for all WebSocket frame types
- Binary and text message support
- Ping/Pong frame handling
- Clean connection termination
- SSL/TLS support for secure WebSocket (WSS)

:::info
**Note:** When using WebSocket with SSL/TLS, make sure both your PyServe SSL configuration and the backend SSL settings are properly configured.
:::

## SSL/TLS Configuration

PyServe supports SSL/TLS for both frontend and backend connections:

```yaml
# Frontend SSL (Client to PyServe)
ssl:
  enabled: true
  cert_file: ./ssl/cert.pem
  key_file: ./ssl/key.pem

# Backend SSL (PyServe to Backend)
server:
  reverse_proxy:
    - host: secure.example.com
      path: /secure
      port: 443
      ssl: true      # Enable SSL for backend connection
```

## Headers and Forwarding

PyServe automatically handles and forwards important headers:

| Header | Description |
|--------|-------------|
| `X-Forwarded-For` | Original client IP address |
| `X-Forwarded-Proto` | Original protocol (http/https) |
| `X-Forwarded-Host` | Original host header |
| `Upgrade` | For WebSocket connections |
| `Connection` | Connection type |

## Examples

### API Gateway

```yaml
server:
  reverse_proxy:
    - host: auth.internal
      path: /auth
      port: 3000
    - host: api.internal
      path: /api/v1
      port: 8000
    - host: api.internal
      path: /api/v2
      port: 8001
```

### WebSocket Chat Server

```yaml
server:
  reverse_proxy:
    - host: chat.internal
      path: /ws/chat
      port: 8080
      websocket: true
    - host: notifications.internal
      path: /ws/notifications
      port: 8081
      websocket: true
```

### Mixed HTTP/WebSocket

```yaml
server:
  reverse_proxy:
    - host: api.example.com
      path: /api
      port: 443
      ssl: true
    - host: ws.example.com
      path: /realtime
      port: 443
      websocket: true
      ssl: true
```

## Best Practices

- Always use SSL/TLS for production deployments
- Configure appropriate timeouts for WebSocket connections
- Monitor proxy performance and errors
- Use health checks for backend servers
- Implement proper error handling
- Consider rate limiting for API endpoints

:::warning
**Security Note:** When proxying to internal services, ensure proper security measures are in place to prevent unauthorized access.
:::

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| WebSocket connection fails | Check if `websocket: true` is set and backend supports WebSocket |
| SSL certificate errors | Verify SSL certificate paths and validity |
| Connection refused | Check backend server host and port configuration |
| Path not found | Verify proxy path configuration and backend routes |