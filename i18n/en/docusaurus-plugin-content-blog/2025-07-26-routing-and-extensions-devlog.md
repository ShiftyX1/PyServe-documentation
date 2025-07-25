---
slug: routing-and-extensions-devlog-en
title: Developing Extensible Routing and Extensions System in PyServe
authors: [shifty]
tags: [devlog, routing, extensions, pyserve, architecture]
---

In this technical report, I describe the work on key changes for PyServe 0.5.0: the introduction of extensible routing and a new configuration system via `extensions`.

<!--truncate-->

## Motivation

PyServe was originally conceived as a simple yet flexible server. As the project grew, it became clear that a system was needed to extend functionality without hacking the core and to support complex routing scenarios (regex, SPA, priorities, fallback).

## Architecture Changes

- **`extensions` section in config** — you can now declaratively connect extensions (e.g., for routing).
- **RoutingExtension** — implemented an nginx-style routing module:
  - Support for regex patterns, prefixes, exact matches
  - Route priorities
  - URL parameter capture
  - SPA fallback with exclusions
- **Backward compatibility** — if the user has an old config (v1), the server works as before (`locations`, `reverse_proxy`).
- **Logging** — all key actions of the router and extensions are now logged.

## Example of New Configuration

```yaml
version: 2
extensions:
  - type: routing
    config:
      regex_locations:
        "~^/api/v(?P<version>\\d+)/":
          proxy_pass: "http://backend:3000"
        "=/health":
          return: "200 OK"
          content_type: "text/plain"
        "__default__":
          spa_fallback: true
          root: "./static"
          index_file: "index.html"
          exclude_patterns:
            - "/api/"
            - "/admin/"
```

## How It Works

- On startup, the server determines the config version and the presence of extensions.
- If a routing extension exists, all requests go through it first.
- If not, or if the route is not found, it falls back to the old scheme.
- SPA fallback allows serving index.html for all non-existent paths except API and static files.

## Results and Plans

PyServe is now ready for extension via plugins and custom routers. The next step is to release 0.5.0, test it, and write detailed documentation on creating your own extensions.

**PyServe — fast, extensible, modern.**

[Project GitHub](https://github.com/ShiftyX1/PyServe)
