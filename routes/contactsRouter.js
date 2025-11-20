import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import validateBody from "../helpers/validateBody.js";
import authenticate from "../helpers/authenticate.js";
import {
  createContactSchema,
  updateContactSchema,
  updateStatusSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: Унікальний ідентифікатор контакту
 *         name:
 *           type: string
 *           description: Ім'я контакту
 *         email:
 *           type: string
 *           format: email
 *           description: Email контакту
 *         phone:
 *           type: string
 *           description: Телефон контакту
 *         favorite:
 *           type: boolean
 *           description: Статус обраного контакту
 *           default: false
 *       example:
 *         id: AeHIrLTr6JkxGE6SN-0Rw
 *         name: Allen Raymond
 *         email: nulla.ante@vestibul.co.uk
 *         phone: (992) 914-3792
 *         favorite: false
 *     ContactInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           description: Ім'я контакту
 *         email:
 *           type: string
 *           format: email
 *           description: Email контакту
 *         phone:
 *           type: string
 *           description: Телефон контакту
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         phone: (123) 456-7890
 *     ContactUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Ім'я контакту
 *         email:
 *           type: string
 *           format: email
 *           description: Email контакту
 *         phone:
 *           type: string
 *           description: Телефон контакту
 *       example:
 *         name: Updated Name
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *       example:
 *         message: Not found
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: Отримати всі контакти
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Номер сторінки для пагінації
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Кількість контактів на сторінці
 *       - in: query
 *         name: favorite
 *         schema:
 *           type: boolean
 *         description: Фільтр по обраних контактах
 *     responses:
 *       200:
 *         description: Список всіх контактів
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Не авторизовано
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.get("/", authenticate, getAllContacts);

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Отримати контакт за ID
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID контакту
 *     responses:
 *       200:
 *         description: Контакт знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Контакт не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.get("/:id", authenticate, getOneContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   delete:
 *     summary: Видалити контакт
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID контакту
 *     responses:
 *       200:
 *         description: Контакт видалено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Контакт не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.delete("/:id", authenticate, deleteContact);

/**
 * @swagger
 * /api/contacts:
 *   post:
 *     summary: Створити новий контакт
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactInput'
 *     responses:
 *       201:
 *         description: Контакт успішно створено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Помилка валідації
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.post("/", authenticate, validateBody(createContactSchema), createContact);

/**
 * @swagger
 * /api/contacts/{id}:
 *   put:
 *     summary: Оновити контакт
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID контакту
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactUpdate'
 *     responses:
 *       200:
 *         description: Контакт оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Помилка валідації або порожнє body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Контакт не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.put("/:id", authenticate, validateBody(updateContactSchema), updateContact);

/**
 * @swagger
 * /api/contacts/{contactId}/favorite:
 *   patch:
 *     summary: Оновити статус favorite контакту
 *     tags: [Contacts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: contactId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID контакту
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - favorite
 *             properties:
 *               favorite:
 *                 type: boolean
 *                 description: Статус обраного контакту
 *             example:
 *               favorite: true
 *     responses:
 *       200:
 *         description: Статус контакту оновлено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Контакт не знайдено
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
contactsRouter.patch(
  "/:contactId/favorite",
  authenticate,
  validateBody(updateStatusSchema),
  updateStatusContact
);

export default contactsRouter;
