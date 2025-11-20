# goit-node-rest-api

REST API для роботи з колекцією контактів.

## Встановлення та запуск

### Встановлення залежностей

```bash
npm install
```

### Запуск проекту

**Режим розробки (з автоперезапуском):**
```bash
npm run dev
```

**Продакшн режим:**
```bash
npm start
```

Сервер буде доступний за адресою: `http://localhost:3000`

## Swagger документація

Після запуску сервера API документація доступна за адресою:

**http://localhost:3000/api-docs**

Swagger UI надає інтерактивну документацію, де можна:
- 📖 Переглянути всі доступні ендпоінти
- 🧪 Тестувати API запити прямо з браузера
- 📝 Переглянути схеми запитів та відповідей

### Експорт для Postman

Для імпорту API в Postman використайте JSON специфікацію:

**http://localhost:3000/api-docs.json**

**Як імпортувати в Postman:**
1. Відкрийте Postman
2. Натисніть `Import` у верхньому лівому куті
3. Вставте URL: `http://localhost:3000/api-docs.json`
4. Натисніть `Continue` → `Import`
5. Готово! Всі ендпоінти автоматично додані в колекцію

## API Endpoints

### 1. Отримати всі контакти

**GET** `/api/contacts`

**Відповідь (200):**
```json
[
  {
    "id": "AeHIrLTr6JkxGE6SN-0Rw",
    "name": "Allen Raymond",
    "email": "nulla.ante@vestibul.co.uk",
    "phone": "(992) 914-3792"
  },
  ...
]
```

### 2. Отримати контакт за ID

**GET** `/api/contacts/:id`

**Параметри:**
- `id` - ID контакту

**Відповідь (200):**
```json
{
  "id": "AeHIrLTr6JkxGE6SN-0Rw",
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792"
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

### 3. Створити новий контакт

**POST** `/api/contacts`

**Body (всі поля обов'язкові):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "(123) 456-7890"
}
```

**Відповідь (201):**
```json
{
  "id": "generated-id",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "(123) 456-7890"
}
```

**Відповідь (400) - помилка валідації:**
```json
{
  "message": "\"name\" is required"
}
```

### 4. Оновити контакт

**PUT** `/api/contacts/:id`

**Параметри:**
- `id` - ID контакту

**Body (хоча б одне поле):**
```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "(999) 999-9999"
}
```

**Відповідь (200):**
```json
{
  "id": "AeHIrLTr6JkxGE6SN-0Rw",
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "(999) 999-9999"
}
```

**Відповідь (400) - порожнє body:**
```json
{
  "message": "Body must have at least one field"
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

### 5. Видалити контакт

**DELETE** `/api/contacts/:id`

**Параметри:**
- `id` - ID контакту

**Відповідь (200):**
```json
{
  "id": "AeHIrLTr6JkxGE6SN-0Rw",
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792"
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

## Тестування в Postman

### Створення колекції

1. Відкрийте Postman
2. Створіть нову колекцію "Contacts API"
3. Додайте змінну `baseUrl` зі значенням `http://localhost:3000`

### Приклади запитів

#### 1. Отримати всі контакти
- Метод: `GET`
- URL: `{{baseUrl}}/api/contacts`

#### 2. Отримати контакт за ID
- Метод: `GET`
- URL: `{{baseUrl}}/api/contacts/AeHIrLTr6JkxGE6SN-0Rw`

#### 3. Створити контакт
- Метод: `POST`
- URL: `{{baseUrl}}/api/contacts`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "phone": "(111) 222-3333"
}
```

#### 4. Оновити контакт
- Метод: `PUT`
- URL: `{{baseUrl}}/api/contacts/AeHIrLTr6JkxGE6SN-0Rw`
- Headers: `Content-Type: application/json`
- Body (raw JSON):
```json
{
  "name": "Updated Name"
}
```

#### 5. Видалити контакт
- Метод: `DELETE`
- URL: `{{baseUrl}}/api/contacts/AeHIrLTr6JkxGE6SN-0Rw`

## Структура проекту

```
goit-node-rest-api/
├── controllers/
│   └── contactsControllers.js  # Контролери для обробки запитів
├── db/
│   └── contacts.json           # База даних контактів
├── helpers/
│   ├── HttpError.js            # Функція для створення HTTP помилок
│   └── validateBody.js         # Міддлвар для валідації body
├── routes/
│   └── contactsRouter.js       # Роути API
├── schemas/
│   └── contactsSchemas.js      # Joi схеми валідації
├── services/
│   └── contactsServices.js     # Бізнес-логіка роботи з контактами
├── app.js                      # Точка входу додатку
└── package.json                # Конфігурація проекту
```

## Технології

- **Node.js** - середовище виконання JavaScript
- **Express** - веб-фреймворк
- **Joi** - валідація даних
- **nanoid** - генерація унікальних ID
- **Morgan** - логування HTTP запитів
- **CORS** - підтримка cross-origin запитів
- **Swagger** - автоматична генерація API документації

## Вимоги

- Node.js версії LTS або новіше
- npm або yarn

## Автор

Serhii Palamarchuk
