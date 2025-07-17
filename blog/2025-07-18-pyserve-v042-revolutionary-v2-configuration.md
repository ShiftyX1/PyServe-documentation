---
slug: pyserve-v042-revolutionary-v2-configuration
title: PyServe v0.4.2 - система конфигурации V2 с расширениями
authors: [shifty]
tags: [release]
---

PyServe v0.4.2 привносит систему конфигурации V2 с поддержкой расширений, сохраняя при этом полную обратную совместимость.

<!--truncate-->

## Что нового в v0.4.2

### Система конфигурации V2

Главная фишка версии 0.4.2 - это совершенно новая система конфигурации V2, которая открывает безграничные возможности для настройки сервера:

#### Ключевые особенности V2:
- **Модульные расширения** - загружайте функциональность по мере необходимости
- **Regex-маршрутизация** - мощные паттерны в стиле nginx с приоритетами
- **Нативная поддержка SPA** - идеально для современных веб-приложений
- **Захват параметров URL** - динамическая маршрутизация с извлечением данных
- **Внешние модули конфигурации** - организуйте настройки в отдельных файлах
- **Полная обратная совместимость** - все V1 конфигурации работают без изменений

## Продвинутая маршрутизация

### Regex-паттерны с приоритетами

Система V2 использует приоритеты маршрутизации в стиле nginx:

```yaml
version: 2

extensions:
  - type: routing
    config:
      regex_locations:
        # 1. Точное совпадение (наивысший приоритет)
        "=/health":
          return: "200 OK"
          content_type: "application/json"
        
        # 2. Regex с захватом параметров
        "~^/api/v(?P<version>\\d+)/users/(?P<id>\\d+)":
          proxy_pass: "http://user-service:3001"
          headers:
            - "API-Version: {version}"
            - "User-ID: {id}"
        
        # 3. Статические файлы с кешированием
        "~*\\.(js|css|png|jpg|gif|ico|svg)$":
          root: "./static"
          cache_control: "public, max-age=31536000, immutable"
        
        # 4. SPA fallback (самый низкий приоритет)
        "__default__":
          spa_fallback: true
          root: "./dist"
          index_file: "index.html"
```

### Поддержка одностраничных приложений (SPA)

Теперь PyServe нативно поддерживает SPA с интеллектуальным fallback:

```yaml
"__default__":
  spa_fallback: true
  root: "./dist"
  index_file: "index.html"
  exclude_patterns:
    - "/api/"      # API запросы не перенаправляются
    - "/admin/"    # Админка обрабатывается отдельно
```

## Микросервисная архитектура

### API Gateway из коробки

V2 превращает PyServe в мощный API Gateway:

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

### Умный роутинг с версионированием

```yaml
"~^/api/v(?P<version>\\d+)/":
  proxy_pass: "http://backend-v{version}:3000"
  headers:
    - "API-Version: {version}"
    - "X-Gateway: PyServe"
```

## Модульная архитектура

### Внешние расширения

Организуйте сложные конфигурации в отдельных модулях:

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

### Доступные расширения

#### Встроенные расширения:
- **Routing** - продвинутая маршрутизация с регулярными выражениями
- **Security** - CORS, rate limiting, CSRF защита  
- **Caching** - Redis и memory кеширование
- **Monitoring** - метрики и health checks

## Продакшн-готовые конфигурации

### Высоконагруженный сервер

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
        # Микросервисы с балансировкой
        "~^/api/v(?P<version>\\d+)/users/":
          proxy_pass: "http://user-cluster:3001"
          headers:
            - "API-Version: {version}"
        
        # Агрессивное кеширование статики
        "~*\\.(js|css|png|jpg|gif|ico|svg|woff2?)$":
          root: "/var/www/static"
          cache_control: "public, max-age=31536000, immutable"
        
        # Мониторинг
        "=/metrics":
          proxy_pass: "http://prometheus:9090"
  
  - type: caching
    config:
      backend: redis
      url: "redis://cache-cluster:6379"
      rules:
        "~*\\.(js|css)$": 86400  # 1 день
        "~^/api/": 300           # 5 минут
```

## Миграция без поломок

### Простейший способ

Добавьте всего одну строку к существующей конфигурации:

```yaml
version: 2  # <- Добавьте эту строку

# Вся остальная V1 конфигурация работает как прежде
server:
  host: 127.0.0.1
  port: 8000
```

### Постепенная миграция

1. **Начните безопасно** - добавьте `version: 2`
2. **Тестируйте** - убедитесь, что всё работает
3. **Мигрируйте постепенно** - переносите маршруты в расширения
4. **Добавляйте новые возможности** - SPA, параметры, кеширование

## Интеграция с Vibe-Serving

### Гибридная конфигурация

Объедините статичную маршрутизацию с ИИ-контентом:

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
          vibe_serving: true  # ИИ для остального контента

# vibeconfig.yaml
routes:
  "/": "Создай современную панель управления"
  "/reports": "Сгенерируй страницу с интерактивными отчетами"

settings:
  enable_v2_routing: true
  cache_ttl: 1800
```

## Улучшения производительности

### Оптимизированная обработка

- **Приоритетная маршрутизация** - быстрое сопоставление паттернов
- **Умное кеширование** - правила кеширования на уровне маршрутов  
- **Асинхронная обработка** - неблокирующие операции
- **Graceful degradation** - отказоустойчивость расширений

### Мониторинг и метрики

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

## Программный API

### Динамическая конфигурация

```python
from pyserve import Configuration

# Загрузка конфигурации
config = Configuration('./config.yaml')

# Добавление маршрутов на лету
config.add_route_extension({
    "~^/new-api/": {
        "proxy_pass": "http://new-service:3000"
    }
})

# Перезагрузка конфигурации
config.reload()
```

## Обновленная документация

- **Полное руководство по V2** - все возможности с примерами
- **Cookbook рецепты** - готовые решения для типовых задач
- **Migration guide** - пошаговая миграция с V1
- **Best practices** - рекомендации для продакшена

## Заключение

PyServe v0.4.2 - это крупный шаг на пути к полноценному релизу. Объединение простоты использования с гибкостью, сохраняя при этом философию "работает из коробки".

### Полезные ссылки:

- [Документация V2 конфигурации](https://docs.pyserve.org/docs/installation-and-setup/configuration)

---

