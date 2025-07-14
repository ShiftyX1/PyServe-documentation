---
sidebar_position: 1
---

# Static Files

Learn how to serve static files with PyServe

## Static Files Overview

PyServe makes it easy to serve static files like HTML, CSS, JavaScript, images, and other assets. By default, static files are served from the `./static` directory, but you can configure this location.

:::info
**Note:** PyServe will automatically create the static directory if it doesn't exist.
:::

## Directory Structure

A typical static files directory structure might look like this:

```
static/
├── css/
│   ├── styles.css
│   └── normalize.css
├── js/
│   ├── main.js
│   └── utils.js
├── images/
│   ├── logo.png
│   └── background.jpg
├── fonts/
│   └── roboto.woff2
└── index.html
```

This organization is recommended but not required. You can structure your static directory however you prefer.

## Accessing Static Files

There are two ways to access static files:

### 1. Using the /static/ prefix

Files placed in the static directory can be accessed using the `/static/` prefix in URLs:

```
http://localhost:8000/static/css/styles.css
http://localhost:8000/static/js/main.js
http://localhost:8000/static/images/logo.png
```

### 2. Direct access at the root

Files in the static directory can also be accessed directly from the root URL:

```
http://localhost:8000/index.html
http://localhost:8000/css/styles.css
http://localhost:8000/js/main.js
```

:::info
**Note:** If a file exists at the root path, it takes precedence over the corresponding path in the static directory.
:::

## Configuring Static Files Directory

You can change the static files directory in several ways:

### Using command line arguments
```bash
python run.py -s ./public
```

### Using the configuration file
```yaml
http:
  static_dir: ./public
```

## Content Types

PyServe automatically sets the appropriate `Content-Type` header based on the file extension. Here are the supported content types:

| Extension | Content Type |
|-----------|--------------|
| `.html` | text/html |
| `.css` | text/css |
| `.js` | application/javascript |
| `.json` | application/json |
| `.png` | image/png |
| `.jpg, .jpeg` | image/jpeg |
| `.gif` | image/gif |
| `.svg` | image/svg+xml |
| `.ico` | image/x-icon |
| other | application/octet-stream |

## Example: HTML Page with Static Resources

Here's an example of a simple HTML page that references CSS and JavaScript files:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PyServe Example</title>
    <link rel="stylesheet" href="/static/css/styles.css">
</head>
<body>
    <div class="container">
        <h1>Welcome to PyServe</h1>
        <p>This is a simple example page.</p>
        <img src="/static/images/logo.png" alt="Logo">
    </div>
    
    <script src="/static/js/main.js"></script>
</body>
</html>
```

With the corresponding CSS file `static/css/styles.css`:

```css
body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem;
}

h1 {
    color: #2c3e50;
}
```

And JavaScript file `static/js/main.js`:

```javascript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded successfully');
});
```

## Security Considerations

### Directory Traversal Protection

PyServe includes protection against directory traversal attacks, preventing access to files outside the static directory using paths like `../../../etc/passwd`.

### File Permissions

Make sure your static files have appropriate permissions. PyServe runs with the permissions of the user who starts it, so it can only serve files that this user has permission to read.

:::warning
**Warning:** Be careful about what you place in your static directory. Do not include sensitive information or configuration files that should not be publicly accessible.
:::

## Best Practices

- Organize your static files in subdirectories by type (css, js, images, etc.)
- Minimize the size of static files for production use
- Use descriptive filenames that indicate the purpose of the file
- Consider using versioning in filenames (e.g., `styles.v1.css`) to handle caching
- For large applications, consider using a CDN or dedicated static file server in production
