---
sidebar_position: 1
---

# Authentication

Learn how to secure your routes with Basic HTTP Authentication in PyServe

## Basic Authentication Overview

PyServe supports Basic HTTP Authentication to protect specific routes in your application. This feature allows you to restrict access to certain paths, requiring users to provide valid credentials before accessing the content.

> **Note:** Basic Authentication sends credentials encoded (not encrypted). For production use, always enable SSL/TLS to secure the authentication process.

## Configuration

Authentication is configured in the `locations` section of your `config.yaml` file. You can protect multiple routes with different credentials.

```yaml
server:
  locations:
    /admin:  # Route to protect
      auth:
        type: basic
        username: admin
        password: secretpass
    /api:    # Another protected route
      auth:
        type: basic
        username: apiuser
        password: apipass
```

### Configuration Options

| Option | Description | Required |
|--------|-------------|----------|
| `type` | Authentication type (currently only 'basic' is supported) | Yes |
| `username` | Username for authentication | Yes |
| `password` | Password for authentication | Yes |

## How It Works

When a client tries to access a protected route:

1. If no credentials are provided, the server responds with a 401 status code and a `WWW-Authenticate` header
2. The browser shows a login dialog to the user
3. User enters credentials which are base64 encoded and sent in the `Authorization` header
4. Server validates the credentials and either:
   - Grants access if credentials are valid
   - Returns 401 if credentials are invalid

```http
# Example HTTP exchange:

-> Client request without credentials:
GET /admin HTTP/1.1
Host: example.com

<- Server response:
HTTP/1.1 401 Unauthorized
WWW-Authenticate: Basic realm="Restricted Area"

-> Client request with credentials:
GET /admin HTTP/1.1
Host: example.com
Authorization: Basic YWRtaW46cGFzc3dvcmQ=

<- Server response if credentials are valid:
HTTP/1.1 200 OK
...
```

## Security Best Practices

- Always use HTTPS (SSL/TLS) when using Basic Authentication
- Use strong passwords
- Consider implementing rate limiting for failed authentication attempts
- Use environment variables for sensitive credentials instead of hardcoding them in config files
- Regularly rotate credentials
- Consider using more secure authentication methods for sensitive data

> **Warning:** Basic Authentication should not be used as the sole security measure for highly sensitive data. Consider implementing additional security measures like session management or token-based authentication for such cases.

## Logging

Authentication attempts are logged for security monitoring. Failed authentication attempts are logged at WARNING level, while successful ones are logged at DEBUG level.

```
[2024-03-21 14:30:45] [WARNING] Invalid credentials for user: admin
[2024-03-21 14:30:52] [DEBUG] Basic auth successful for user: admin
```

Enable DEBUG level logging to see detailed authentication information:

```yaml
logging:
  level: DEBUG
```

## Examples

### Protecting Multiple Routes

```yaml
server:
  locations:
    /admin:
      auth:
        type: basic
        username: admin
        password: adminpass
    /api:
      auth:
        type: basic
        username: apiuser
        password: apipass
    /docs:
      auth:
        type: basic
        username: docs
        password: docspass
```

### Using Environment Variables

```bash
# Set environment variables
export ADMIN_USER=admin
export ADMIN_PASS=secretpass
```

```yaml
# In config.yaml
server:
  locations:
    /admin:
      auth:
        type: basic
        username: ${ADMIN_USER}
        password: ${ADMIN_PASS}
```

## Troubleshooting

### Common Issues

| Problem | Possible Solution |
|---------|------------------|
| Authentication dialog appears repeatedly | Check if credentials are correct and properly configured in config.yaml |
| No authentication prompt | Verify the route is properly configured in the locations section |
| Credentials not working | Check log files for detailed error messages and verify credentials in config |
