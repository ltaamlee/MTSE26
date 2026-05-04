const express = require("express");
const router = express.Router();

const homeController = require("../controllers/homeController");

let initWebRoutes = (app) => {

        router.get('/home', homeController.getHomePage); //url cho trang chủ
        router.get('/about', homeController.getAboutPage); //url cho trang about
        router.get('/crud', homeController.getCRUD); //url get crud
        router.post('/post-crud', homeController.postCRUD); //url post crud
        router.get('/get-crud',homeController.findAllCRUD) //url lay findAll
        router.get('/edit-crud', homeController.editCRUD); //url get editcrud
        router.post('/put-crud', homeController.putCRUD); //url put crud
        router.get('/delete-crud', homeController.deleteCRUD); //url get delete crud

        return app.use('/', router);
}

module.exports = initWebRoutes;