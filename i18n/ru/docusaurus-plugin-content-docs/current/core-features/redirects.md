---
sidebar_position: 3
---

# Перенаправления URL

Узнайте, как настроить перенаправления URL в PyServe

## Обзор перенаправлений

Перенаправление URL - это техника для переадресации пользователей и поисковых систем с одного URL на другой. PyServe предоставляет простой способ настройки перенаправлений через файл конфигурации.

:::info
**Распространенные случаи использования:** Перенаправления полезны для обработки перемещенных страниц, создания коротких URL, сохранения SEO при реструктуризации сайта или переадресации пользователей на канонические URL.
:::

## Настройка перенаправлений

Перенаправления в PyServe настраиваются в разделе `redirect_instructions` файла `config.yaml`:

```yaml
server:
  # Другие настройки сервера...
  redirect_instructions:
    - /home: /index.html
    - /blog: https://example.com/blog
    - /products: /shop/products.html
```

Формат представляет собой список пар ключ-значение, где:
- **Ключ**: Путь для сопоставления (исходный URL)
- **Значение**: URL назначения для перенаправления (целевой URL)

## Как работают перенаправления

Когда PyServe получает запрос, он проверяет, точно ли соответствует путь запроса какому-либо из настроенных источников перенаправления:

1. Если совпадение найдено, PyServe возвращает HTTP 302 Found ответ
2. Ответ включает заголовок `Location` с целевым URL
3. Браузер клиента автоматически следует перенаправлению на новое местоположение

:::info
**Параметры запроса:** PyServe сохранит параметры запроса при перенаправлении. Например, если пользователь посещает `/home?param=value` и у вас есть перенаправление с `/home` на `/index.html`, пользователь будет перенаправлен на `/index.html?param=value`.
:::

## Типы перенаправлений

### Внутренние перенаправления

Внутренние перенаправления указывают на другой путь на том же сервере. Они начинаются со слеша (`/`):

```yaml
redirect_instructions:
  - /old-page: /new-page
  - /home: /index.html
  - /products: /shop/products.html
```

### Внешние перенаправления

Внешние перенаправления указывают на URL другого домена. Они включают полный URL с протоколом:

```yaml
redirect_instructions:
  - /blog: https://blog.example.com
  - /forum: https://community.example.com
  - /shop: https://store.example.com/products
```

## Примеры

### Пример 1: Базовые перенаправления

Перенаправление старых URL на новые местоположения:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /about-us: /about.html
    - /contact-us: /contact.html
```

### Пример 2: Смешанные внутренние и внешние перенаправления

Комбинация внутренних и внешних перенаправлений:

```yaml
server:
  redirect_instructions:
    - /home: /index.html
    - /blog: https://blog.example.com
    - /shop: /store/index.html
    - /support: https://support.example.com
```

### Пример 3: Сокращение URL

Создание коротких, запоминающихся URL, которые перенаправляют на более длинные:

```yaml
server:
  redirect_instructions:
    - /dl: /downloads/software.html
    - /doc: /documentation/index.html
    - /api: /developers/api-reference.html
```

## Детали реализации

### Код статуса перенаправления

PyServe использует HTTP код статуса `302 Found` для перенаправлений, который сообщает клиенту, что ресурс временно находится по другому URL. Это подходит для большинства случаев использования.

:::info
**Примечание:** В HTTP существует несколько типов перенаправлений (301, 302, 303, 307, 308). PyServe в настоящее время поддерживает только перенаправления 302. Для ситуаций, где нужны постоянные (301) перенаправления для SEO целей, рассмотрите использование веб-сервера производственного уровня, такого как Nginx или Apache.
:::

### Обработка перенаправлений

Обработка перенаправлений происходит до проверки статических файлов или других обработчиков запросов. Это означает, что перенаправления имеют приоритет над любыми другими правилами маршрутизации в сервере.

## Лучшие практики

### SEO соображения

- Помните, что поисковые системы рассматривают перенаправления 302 как временные, что означает, что они сохранят старый URL в индексе
- Для постоянной реструктуризации сайта рассмотрите использование сервера, поддерживающего перенаправления 301 (постоянные)
- Избегайте цепочек перенаправлений (перенаправления, указывающие на другие перенаправления), поскольку они замедляют пользовательский опыт

### Пользовательский опыт

- Сведите перенаправления к минимуму, чтобы избежать замедления пользовательского опыта
- Используйте четкие, последовательные шаблоны для правил перенаправления
- Рассмотрите добавление краткой страницы задержки для внешних перенаправлений, чтобы информировать пользователей о том, что они покидают ваш сайт

### Обслуживание

- Документируйте ваши правила перенаправления, чтобы упростить будущее обслуживание
- Периодически проверяйте перенаправления, чтобы убедиться, что они все еще нужны и работают правильно
- Группируйте перенаправления логически в файле конфигурации для лучшей читаемости

## Расширенное использование

### Программные перенаправления

Если вам нужны более динамичные правила перенаправления, чем поддерживает файл конфигурации, вы можете расширить класс `HTTPServer` для реализации пользовательской логики перенаправления:

```python
from pyserve import HTTPServer, HTTPResponse

class MyServer(HTTPServer):
    def handle_request(self, request_data, client_address):
        request = self.parse_request(request_data)
        
        # Пользовательская логика перенаправления на основе свойств запроса
        if request.path.startswith('/user/') and 'id' in request.query_params:
            user_id = request.query_params['id'][0]
            return HTTPResponse(302, headers={'Location': f'/profile?user={user_id}'})
            
        # Возврат к обработке по умолчанию
        return super().handle_request(request_data, client_address)
```

### Перенаправление с параметрами запроса

Метод `handle_redirection` в PyServe автоматически сохраняет параметры запроса при перенаправлении. Например, если у вас есть перенаправление с `/search` на `/find` и пользователь посещает `/search?q=keyword`, он будет перенаправлен на `/find?q=keyword`.

```python
def handle_redirection(self, request):
    """
    Обрабатывает перенаправление запроса
    
    Args:
        request: HTTP-запрос
        
    Returns:
        HTTPResponse: Ответ перенаправления
    """
    target_url = self.redirections[request.path]
    
    # Добавить параметры запроса к перенаправлению, если они существуют
    if request.query_params:
        query_parts = []
        for key, values in request.query_params.items():
            for value in values:
                query_parts.append(f"{key}={value}")
        if query_parts:
            target_url += "?" + "&".join(query_parts)
    
    return HTTPResponse(302, headers={'Location': target_url})
```

## Устранение неполадок

### Частые проблемы

#### Перенаправление не работает

- Убедитесь, что путь в вашей конфигурации точно соответствует пути запроса (с учетом регистра)
- Проверьте, что целевой URL правильно отформатирован (внутренние пути должны начинаться со слеша)
- Убедитесь, что правило перенаправления правильно отформатировано в файле `config.yaml`

#### Цикл перенаправления

Цикл перенаправления возникает, когда перенаправление указывает само на себя или создает циклическую цепочку. Например:
- Прямой цикл: `/page1` перенаправляет на `/page1`
- Циклическая цепочка: `/page1` перенаправляет на `/page2`, который перенаправляет обратно на `/page1`

Чтобы исправить это, проверьте ваши правила перенаправления и убедитесь, что они не создают циклических ссылок.

#### Отладочное логирование

Включите режим отладки, чтобы видеть подробные логи обработки перенаправлений:

```bash
python run.py -d
```

Это покажет сообщения вроде `Перенаправление /home на /index.html` в консоли.

## Заключение

Система перенаправления PyServe предоставляет простой способ настройки перенаправлений URL без изменения кода приложения. Хотя в настоящее время она поддерживает только перенаправления 302, она подходит для большинства случаев разработки и внутреннего использования.

Для более сложных потребностей в перенаправлении или производственных сред рассмотрите использование PyServe как части более крупной инфраструктуры с выделенным веб-сервером или балансировщиком нагрузки, обрабатывающим расширенные правила перенаправления.