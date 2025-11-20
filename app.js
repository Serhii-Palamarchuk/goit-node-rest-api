import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

import contactsRouter from "./routes/contactsRouter.js";
import swaggerSpec from "./swagger.js";
import sequelize from "./db/db.js";
import Contact from "./models/Contact.js";

dotenv.config();

// REST API server
const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

// Підключення до бази даних та запуск сервера
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error.message);
    process.exit(1);
  });

