const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize("buoi1", "root", "0111c00021", {
    host: "localhost",
    dialect: "mysql",
    logging: false
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = sequelize.define("User", {
    name: DataTypes.STRING,
    email: DataTypes.STRING
});

// test connect
sequelize.authenticate()
    .then(() => console.log("✅ Connect DB thành công"))
    .catch(err => console.error("❌ Lỗi DB:", err));

module.exports = db;