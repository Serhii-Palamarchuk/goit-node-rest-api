import app from "./app.js";
import sequelize from "./db/db.js";

const PORT = process.env.PORT || 3000;

// Підключення до бази даних та запуск сервера
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection successful");
    return sequelize.sync({ alter: true });
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
