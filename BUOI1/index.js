const express = require("express");
const configViewEngine = require("./src/config/viewEngine");
const initWebRoutes = require("./src/routes/web");
const db = require("./src/models/index"); // 👈 import DB

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

initWebRoutes(app);

db.sequelize.authenticate()
  .then(() => console.log("✅ Connect DB thành công"))
  .catch(err => console.error("❌ Lỗi DB:", err));

db.sequelize.sync();

app.listen(8088, () => {
  console.log("🚀 Server running at http://localhost:8088");
});