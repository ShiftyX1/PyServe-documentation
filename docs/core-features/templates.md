---
sidebar_position: 2
---

# Templates

Learn how to use the PyServe template engine

## Templates Overview

PyServe includes a simple but effective template engine that allows you to create dynamic HTML pages. Templates are stored in the `./templates` directory by default and use a straightforward placeholder syntax for variable substitution.

:::info Note
The template system is intentionally lightweight. For more complex templating needs, consider using a dedicated template engine or a full web framework.
:::

## Template Syntax

The PyServe template engine uses double curly braces `{{ variable }}` for variable substitution.

### Basic example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{title}}</title>
</head>
<body>
    <h1>Hello, {{name}}!</h1>
    <p>Welcome to PyServe.</p>
</body>
</html>
```

When rendered with the context `{"title": "Welcome Page", "name": "User"}`, this will produce:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome Page</title>
</head>
<body>
    <h1>Hello, User!</h1>
    <p>Welcome to PyServe.</p>
</body>
</html>
```

## Using Templates in PyServe

The template engine is primarily used internally by PyServe for error pages, but you can also use it in your own applications by extending the server.

### Template Directory

By default, templates are stored in the `./templates` directory. You can configure this location:

#### Using command line arguments:

```bash
python run.py -t ./views
```

#### Using the configuration file:

```yaml
http:
  templates_dir: ./views
```

## Error Pages

PyServe uses templates for error pages. By default, it looks for templates named `error_XXX.html` where XXX is the status code (e.g., `error_404.html`).

If a specific error template is not found, it falls back to the generic `errors.html` template.

### Example error_404.html:

```html
<!DOCTYPE html>
<html>
<head>
    <title>{{status_code}} - {{status_text}}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #e74c3c;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>{{status_code}} - {{status_text}}</h1>
        <p>{{error_details}}</p>
        <p><a href="/">Return to home page</a></p>
    </div>
</body>
</html>
```

## Using Templates in Your Application

To use templates in your application, you can extend the PyServe server and implement your own template rendering logic.
