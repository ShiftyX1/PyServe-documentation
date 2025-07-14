---
sidebar_position: 3
---

# URL Redirects

Learn how to configure URL redirections in PyServe

## Redirects Overview

URL redirection is a technique to forward users and search engines from one URL to another. PyServe provides a simple way to configure redirects through the configuration file.

:::info
**Common Use Cases:** Redirects are useful for handling moved pages, creating short URLs, preserving SEO when restructuring a website, or forwarding users to canonical URLs.
:::

## Configuring Redirects

Redirects in PyServe are configured in the `redirect_instructions` section of your `config.yaml` file:

```yaml
server:
  # Other server settings...
  redirect_instructions:
    - /home: /index.html
    - /blog: https://example.com/blog
    - /products: /shop/products.html
```

The format is a list of key-value pairs where:
- **Key**: The path to match (source URL)
- **Value**: The destination URL to redirect to (target URL)

## How Redirects Work

When a request is received by PyServe, it checks if the request path exactly matches any of the configured redirect sources:

1. If a match is found, PyServe returns an HTTP 302 Found response
2. The response includes a `Location` header with the target URL
3. The client's browser automatically follows the redirect to the new location

:::info
**Query Parameters:** PyServe will preserve query parameters when redirecting. For example, if a user visits `/home?param=value` and you have a redirect from `/home` to `/index.html`, the user will be redirected to `/index.html?param=value`.
:::

## Types of Redirects

### Internal Redirects

Internal redirects point to another path on the same server. They start with a slash (`/`):

```yaml
redirect_instructions:
  - /old-page: /new-page
  - /home: /index.html
  - /products: /shop/products.html
```

### External Redirects

External redirects point to a URL on a different domain. They include the full URL with protocol:

```yaml
redirect_instructions:
  - /blog: https://blog.example.com
  - /forum: https://community.example.com
  - /shop: https://store.example.com/products
```

## Examples

### Example 1: Basic Redirects

Redirect old URLs to new locations:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /about-us: /about.html
    - /contact-us: /contact.html
```

### Example 2: Mixed Internal and External Redirects

A combination of internal and external redirects:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /blog: https://blog.example.com
    - /shop: /store/index.html
    - /support: https://support.example.com
```

### Example 3: Shortening URLs

Create short, memorable URLs that redirect to longer ones:

```yaml
server:
  redirect_instructions:
    - /dl: /downloads/software.html
    - /doc: /documentation/index.html
    - /api: /developers/api-reference.html
```

## Implementation Details

### Redirect Status Code

PyServe uses HTTP status code `302 Found` for redirects, which tells the client that the resource is temporarily located at a different URL. This is appropriate for most use cases.

:::info
**Note:** In HTTP, there are several types of redirects (301, 302, 303, 307, 308). PyServe currently only supports 302 redirects. For situations where permanent (301) redirects are needed for SEO purposes, consider using a production-grade web server like Nginx or Apache.
:::

### Redirect Processing

Redirect processing happens before checking static files or other request handlers. This means redirects take precedence over any other routing rules in the server.

## Best Practices

### SEO Considerations

- Be aware that search engines treat 302 redirects as temporary, which means they will keep the old URL indexed
- For permanent site restructuring, consider using a server that supports 301 (permanent) redirects
- Avoid redirect chains (redirects pointing to other redirects) as they slow down the user experience

### User Experience

- Keep redirects to a minimum to avoid slowing down the user experience
- Use clear, consistent patterns for redirect rules
- Consider adding a brief delay page for external redirects to inform users they're leaving your site

### Maintenance

- Document your redirect rules to make future maintenance easier
- Periodically review redirects to ensure they're still needed and working correctly
- Group redirects logically in your configuration file for better readability

## Advanced Usage

### Programmatic Redirects

If you need more dynamic redirect rules than what the configuration file supports, you can extend the `HTTPServer` class to implement custom redirect logic:

```python
from pyserve import HTTPServer, HTTPResponse

class MyServer(HTTPServer):
    def handle_request(self, request_data, client_address):
        request = self.parse_request(request_data)
        
        # Custom redirect logic based on request properties
        if request.path.startswith('/user/') and 'id' in request.query_params:
            user_id = request.query_params['id'][0]
            return HTTPResponse(302, headers={'Location': f'/profile?user={user_id}'})
            
        # Fall back to default handling
        return super().handle_request(request_data, client_address)
```

### Redirect with Query Parameters

The `handle_redirection` method in PyServe automatically preserves query parameters when redirecting. For example, if you have a redirect from `/search` to `/find` and a user visits `/search?q=keyword`, they will be redirected to `/find?q=keyword`.

```python
def handle_redirection(self, request):
    """
    Handles request redirection
    
    Args:
        request: HTTP-request
        
    Returns:
        HTTPResponse: Redirect response
    """
    target_url = self.redirections[request.path]
    
    # Add query parameters to the redirection if they exist
    if request.query_params:
        query_parts = []
        for key, values in request.query_params.items():
            for value in values:
                query_parts.append(f"{key}={value}")
        if query_parts:
            target_url += "?" + "&".join(query_parts)
    
    return HTTPResponse(302, headers={'Location': target_url})
```

## Troubleshooting

### Common Issues

#### Redirect Not Working

- Ensure the path in your configuration exactly matches the request path (case-sensitive)
- Check that the target URL is correctly formatted (internal paths should start with a slash)
- Verify that the redirect rule is correctly formatted in your `config.yaml` file

#### Redirect Loop

A redirect loop occurs when a redirect points to itself or creates a circular chain. For example:
- Direct loop: `/page1` redirects to `/page1`
- Circular chain: `/page1` redirects to `/page2` which redirects back to `/page1`

To fix this, review your redirect rules and ensure they don't create circular references.

#### Debug Logging

Enable debug mode to see detailed logs about redirect processing:

```bash
python run.py -d
```

This will show messages like `Redirecting /home to /index.html` in the console.

## Summary

PyServe's redirection system provides a simple way to configure URL redirects without modifying your application code. While it currently only supports 302 redirects, it's suitable for most development and internal use cases.

For more complex redirection needs or production environments, consider using PyServe as part of a larger infrastructure with a dedicated web server or load balancer handling advanced redirection rules.
