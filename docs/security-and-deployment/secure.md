---
sidebar_position: 2
---

# Secure Connections

Learn how to use PyServe with SSL/TLS for HTTPS

## Secure Connections Overview

PyServe now supports SSL/TLS for secure HTTPS connections. This allows you to encrypt all traffic between the client and the server. It is highly recommended to use SSL when exposing PyServe to the public internet.

:::info
**Common Use Cases:** SSL is commonly used for protecting sensitive data, ensuring data integrity, verifying server identity, and complying with security requirements. HTTPS implementation is a requirement for modern web applications.
:::

## Configuring SSL

There are two ways to configure SSL in PyServe:

### 1. Using the Configuration File

Add an `ssl` section to your `config.yaml` file:

```yaml
ssl:
  enabled: true
  cert_file: ./ssl/cert.pem
  key_file: ./ssl/key.pem
```

### 2. Using Command Line Arguments

Use the `--ssl` option along with certificate and key paths when starting PyServe:

```bash
python run.py --ssl --cert ./ssl/cert.pem --key ./ssl/key.pem
```

Or save these settings to your configuration file using:

```bash
python run.py --ssl-config --ssl --cert ./ssl/cert.pem --key ./ssl/key.pem
```

### Configuration Parameters

- `enabled`: Whether SSL is enabled (true/false)
- `cert_file`: The path to the SSL certificate file (.pem format)
- `key_file`: The path to the SSL private key file (.pem format)

## Creating SSL Certificates

### Self-Signed Certificates (Development)

For development and testing purposes, you can create self-signed certificates using OpenSSL:

```bash
# Create directory for certificates
mkdir -p ./ssl

# Generate private key and self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout ./ssl/key.pem -out ./ssl/cert.pem -days 365 -nodes
```

:::warning
**Note:** Self-signed certificates will cause browsers to show security warnings. They're suitable for development but not for production use.
:::

### Production Certificates

For production environments, obtain certificates from a trusted certificate authority like Let's Encrypt:

```bash
# Using certbot (Let's Encrypt)
sudo certbot certonly --standalone --preferred-challenges http -d yourdomain.com
```

Then configure PyServe to use the generated certificates:

```bash
python run.py --ssl --cert /etc/letsencrypt/live/yourdomain.com/fullchain.pem --key /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

## SSL with Reverse Proxy

PyServe can use both SSL and reverse proxy simultaneously, creating a secure gateway to your backend services. This is particularly useful for protecting internal services that don't implement their own SSL.

### Configuration Example

```yaml
ssl:
  enabled: true
  cert_file: ./ssl/cert.pem
  key_file: ./ssl/key.pem

server:
  reverse_proxy:
    - path: /api
      host: localhost
      port: 3000
```

In this setup:
1. Clients connect to PyServe using HTTPS (secure connection)
2. PyServe proxies requests to the backend service over HTTP (internal network)
3. Communication between client and internet is securely encrypted

:::info
**Best Practice:** For production environments, consider securing the connection to backend servers as well, especially if they're on different machines.
:::

## How Secure Connections Work

When SSL is enabled in PyServe:

1. PyServe loads the certificate and private key on startup
2. The server is configured to listen for HTTPS connections instead of HTTP
3. When a client connects, an SSL handshake establishes a secure connection
4. All subsequent data transferred between client and server is encrypted

### Certificate Validation

When a client connects to a PyServe instance with SSL enabled, their browser will validate the server's certificate:

- For certificates from trusted CAs: The connection is established with a lock icon
- For self-signed certificates: The browser will show a warning that must be bypassed

:::info
**Tech Note:** PyServe uses Python's built-in SSL module and asyncio's SSL support to implement secure connections, providing industry-standard TLS encryption.
:::

## Security Best Practices

### Certificate Security

- Keep your private key secure and limit access permissions (`chmod 400 ./ssl/key.pem`)
- Regularly renew certificates before they expire (Let's Encrypt certificates expire after 90 days)
- Use strong key lengths (4096 bits recommended for RSA keys)

### SSL Configuration

- Use TLS 1.2 or higher (PyServe uses Python's default SSL context which prioritizes secure protocols)
- Consider implementing HTTP Strict Transport Security (HSTS) if your site should always use HTTPS
- Redirect HTTP traffic to HTTPS when running in production

### Server Security

- Keep your PyServe installation and its dependencies up to date
- Use a firewall to restrict access to your server
- Consider using a reverse proxy like Nginx for production environments with high traffic

## Troubleshooting

### Common Issues

#### SSL Certificate Problems

If you see an error like `Error loading SSL certificates`, check that:
- The certificate and key files exist at the specified paths
- The files are in the correct PEM format
- PyServe has permission to read these files

#### Browser Security Warnings

If browsers show security warnings when connecting to your server:
- For development: This is normal with self-signed certificates
- For production: Ensure you're using a certificate from a trusted CA
- Check that your certificate hasn't expired
- Verify that the certificate's domain matches your server's domain

#### Debug Logging

Enable debug mode to see detailed logs about SSL connections:

```bash
python run.py -d --ssl --cert ./ssl/cert.pem --key ./ssl/key.pem
```

## Performance Considerations

Enabling SSL adds some overhead to server operations due to encryption/decryption processes:

- Initial connection establishment takes longer due to the SSL handshake
- CPU usage will be slightly higher due to encryption/decryption operations
- Memory usage increases to maintain SSL contexts

However, with modern hardware, this overhead is typically minimal and the security benefits far outweigh the performance costs.

:::info
**Note:** PyServe's asynchronous architecture helps mitigate SSL overhead by efficiently handling multiple connections.
:::
