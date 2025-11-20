# goit-node-rest-api

REST API для управління контактами з автентифікацією користувачів.

**Поточна версія:** Homework #4 - Authentication & Authorization (JWT)

## Встановлення та запуск

### Налаштування бази даних

1. Створіть файл `.env` в корені проекту:
```env
DATABASE_URL=postgresql://user:password@host/database
PORT=3000
JWT_SECRET=your-secret-key-min-32-characters
```

2. Вкажіть:
   - `DATABASE_URL` - URL вашої PostgreSQL бази даних
   - `JWT_SECRET` - секретний ключ для JWT токенів (мінімум 32 символи)

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

### 🔐 Автентифікація

#### 1. Реєстрація користувача

**POST** `/api/auth/register`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Відповідь (201):**
```json
{
  "user": {
    "email": "user@example.com",
    "subscription": "starter"
  }
}
```

**Відповідь (409):**
```json
{
  "message": "Email in use"
}
```

#### 2. Вхід (Login)

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Відповідь (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "user@example.com",
    "subscription": "starter"
  }
}
```

**Відповідь (401):**
```json
{
  "message": "Email or password is wrong"
}
```

#### 3. Вихід (Logout)

**POST** `/api/auth/logout`

**Headers:**
```
Authorization: Bearer <token>
```

**Відповідь (204):** No Content

#### 4. Поточний користувач

**GET** `/api/auth/current`

**Headers:**
```
Authorization: Bearer <token>
```

**Відповідь (200):**
```json
{
  "email": "user@example.com",
  "subscription": "starter"
}
```

**Відповідь (401):**
```json
{
  "message": "Not authorized"
}
```

#### 5. Оновлення підписки (Optional)

**PATCH** `/api/auth/subscription`

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "subscription": "pro"
}
```

**Відповідь (200):**
```json
{
  "email": "user@example.com",
  "subscription": "pro"
}
```

**Можливі значення subscription:** `starter`, `pro`, `business`

---

### 📇 Контакти (потребують автентифікації)

**Всі ендпоінти контактів вимагають JWT токен в заголовку:**
```
Authorization: Bearer <token>
```

#### 1. Отримати всі контакти

**GET** `/api/contacts`

**Query параметри (опціональні):**
- `page` - номер сторінки (default: 1)
- `limit` - кількість контактів на сторінці (default: 20)
- `favorite` - фільтр по обраних контактах (true/false)

**Приклади:**
- `/api/contacts` - всі контакти (перша сторінка, 20 записів)
- `/api/contacts?page=2&limit=10` - друга сторінка, по 10 контактів
- `/api/contacts?favorite=true` - тільки обрані контакти
- `/api/contacts?page=1&limit=5&favorite=true` - перші 5 обраних контактів

**Відповідь (200):**
```json
[
  {
    "id": 1,
    "name": "Allen Raymond",
    "email": "nulla.ante@vestibul.co.uk",
    "phone": "(992) 914-3792",
    "favorite": false,
    "owner": 5
  },
  ...
]
```

**Примітка:** Кожен користувач бачить тільки свої контакти.

#### 2. Отримати контакт за ID

**GET** `/api/contacts/:id`

**Параметри:**
- `id` - ID контакту

**Відповідь (200):**
```json
{
  "id": 1,
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792",
  "favorite": false,
  "owner": 5
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

#### 3. Створити новий контакт

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
  "id": 15,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "(123) 456-7890",
  "favorite": false,
  "owner": 5
}
```

**Відповідь (400) - помилка валідації:**
```json
{
  "message": "\"name\" is required"
}
```

#### 4. Оновити контакт

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
  "id": 1,
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "(999) 999-9999",
  "favorite": false,
  "owner": 5
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

#### 5. Видалити контакт

**DELETE** `/api/contacts/:id`

**Параметри:**
- `id` - ID контакту

**Відповідь (200):**
```json
{
  "id": 1,
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792",
  "favorite": false,
  "owner": 5
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

#### 6. Оновити статус favorite контакту

**PATCH** `/api/contacts/:contactId/favorite`

**Параметри:**
- `contactId` - ID контакту

**Body:**
```json
{
  "favorite": true
}
```

**Відповідь (200):**
```json
{
  "id": "1",
  "name": "Allen Raymond",
  "email": "nulla.ante@vestibul.co.uk",
  "phone": "(992) 914-3792",
  "favorite": true
}
```

**Відповідь (404):**
```json
{
  "message": "Not found"
}
```

## Тестування в Postman

### Крок 1: Реєстрація та отримання токена

1. **Зареєструйте користувача:**
   - POST `http://localhost:3000/api/auth/register`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Увійдіть та отримайте токен:**
   - POST `http://localhost:3000/api/auth/login`
   - Body (JSON):
   ```json
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Скопіюйте `token` з відповіді

3. **Налаштуйте Authorization в Postman:**
   - Перейдіть у вкладку "Authorization"
   - Виберіть тип "Bearer Token"
   - Вставте скопійований токен

### Крок 2: Тестування ендпоінтів контактів

Тепер всі запити до `/api/contacts/*` працюватимуть з вашим токеном.

### Створення колекції

1. Відкрийте Postman
2. Створіть нову колекцію "Contacts API"
3. Додайте змінну `baseUrl` зі значенням `http://localhost:3000`

### Приклади запитів

**⚠️ Важливо:** Для всіх запитів до контактів додайте заголовок:
```
Authorization: Bearer <ваш-токен>
```

#### Auth - Реєстрація
- Метод: `POST`
- URL: `{{baseUrl}}/api/auth/register`
- Body (raw JSON):
```json
{
  "email": "newuser@example.com",
  "password": "securePass123"
}
```

#### Auth - Вхід
- Метод: `POST`
- URL: `{{baseUrl}}/api/auth/login`
- Body (raw JSON):
```json
{
  "email": "newuser@example.com",
  "password": "securePass123"
}
```

#### Auth - Поточний користувач
- Метод: `GET`
- URL: `{{baseUrl}}/api/auth/current`
- Headers: `Authorization: Bearer <token>`

#### Auth - Вихід
- Метод: `POST`
- URL: `{{baseUrl}}/api/auth/logout`
- Headers: `Authorization: Bearer <token>`

#### Auth - Оновлення підписки
- Метод: `PATCH`
- URL: `{{baseUrl}}/api/auth/subscription`
- Headers: `Authorization: Bearer <token>`
- Body (raw JSON):
```json
{
  "subscription": "pro"
}
```

#### 1. Отримати всі контакти
- Метод: `GET`
- URL: `{{baseUrl}}/api/contacts`
- Headers: `Authorization: Bearer <token>`
- Query параметри (опціональні):
  - `?page=1&limit=20` - пагінація
  - `?favorite=true` - фільтр по обраних

#### 2. Отримати контакт за ID
- Метод: `GET`
- URL: `{{baseUrl}}/api/contacts/1`
- Headers: `Authorization: Bearer <token>`

#### 3. Створити контакт
- Метод: `POST`
- URL: `{{baseUrl}}/api/contacts`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
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
- URL: `{{baseUrl}}/api/contacts/1`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Body (raw JSON):
```json
{
  "name": "Updated Name"
}
```

#### 5. Видалити контакт
- Метод: `DELETE`
- URL: `{{baseUrl}}/api/contacts/1`
- Headers: `Authorization: Bearer <token>`

#### 6. Оновити статус favorite
- Метод: `PATCH`
- URL: `{{baseUrl}}/api/contacts/1/favorite`
- Headers: 
  - `Content-Type: application/json`
  - `Authorization: Bearer <token>`
- Body (raw JSON):
```json
{
  "favorite": true
}
```

## Структура проекту

```
goit-node-rest-api/
├── controllers/
│   ├── authControllers.js      # Контролери автентифікації
│   └── contactsControllers.js  # Контролери для обробки запитів контактів
├── db/
│   ├── db.js                   # Підключення до PostgreSQL
│   └── contacts.json           # Старі дані (не використовується)
├── helpers/
│   ├── authenticate.js         # Міддлвар перевірки JWT токенів
│   ├── HttpError.js            # Функція для створення HTTP помилок
│   └── validateBody.js         # Міддлвар для валідації body
├── models/
│   ├── Contact.js              # Sequelize модель Contact з owner
│   └── User.js                 # Sequelize модель User
├── routes/
│   ├── authRouter.js           # Роути автентифікації
│   └── contactsRouter.js       # Роути API контактів (захищені)
├── schemas/
│   ├── authSchemas.js          # Joi схеми валідації auth
│   └── contactsSchemas.js      # Joi схеми валідації контактів
├── services/
│   ├── authServices.js         # Бізнес-логіка автентифікації
│   └── contactsServices.js     # Бізнес-логіка роботи з контактами
├── .env                        # Змінні оточення (не в git)
├── app.js                      # Точка входу додатку
└── package.json                # Конфігурація проекту
```

## Технології

- **Node.js** - середовище виконання JavaScript
- **Express** - веб-фреймворк
- **PostgreSQL** - реляційна база даних
- **Sequelize** - ORM для роботи з базою даних
- **JWT (jsonwebtoken)** - автентифікація через токени
- **bcryptjs** - хешування паролів
- **Joi** - валідація даних
- **dotenv** - управління змінними оточення
- **Morgan** - логування HTTP запитів
- **CORS** - підтримка cross-origin запитів
- **Swagger** - автоматична генерація API документації

## Функціонал

### ✅ Homework #4 - Authentication & Authorization
- Реєстрація користувачів з хешуванням паролів (bcrypt)
- Вхід/вихід з генерацією JWT токенів
- Захист всіх роутів контактів через Bearer Authentication
- Кожен користувач має доступ тільки до своїх контактів
- Модель User з полями: email, password, subscription, token
- Модель Contact з полем owner для зв'язку з користувачем
- **Додаткові завдання:**
  - ✅ Пагінація для контактів (page, limit)
  - ✅ Фільтрація по favorite
  - ✅ Оновлення підписки користувача (PATCH /api/auth/subscription)

### ✅ Homework #3 - PostgreSQL + Sequelize
- Інтеграція PostgreSQL через Sequelize ORM
- CRUD операції через базу даних
- Поле favorite для контактів
- PATCH ендпоінт для оновлення статусу favorite

### ✅ Homework #2 - REST API
- Повний CRUD для контактів
- Валідація через Joi
- Swagger документація
- Обробка помилок

## Вимоги

- Node.js версії LTS або новіше
- PostgreSQL 12 або новіше
- npm або yarn

## Автор

Serhii Palamarchuk
