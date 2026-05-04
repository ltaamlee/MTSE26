const db = require('../models/index');
const CRUDService = require('../services/CRUDService');

let getHomePage = async (req, res) => {
    try {
        let data = await db.User.findAll();
        console.log('-----------------');
        console.log(data);
        console.log('-----------------');
        return res.render('homePage.ejs', {
            data: JSON.stringify(data)
        });
    } catch (e) {
        console.log(e);
    }
}

let getAboutPage = (req, res) => {
    return res.render('test/about.ejs');
}

let getCRUD = (req, res) => {
    return res.render('crud.ejs');
}

let findAllCRUD = async (req, res) => {
    let data = await CRUDService.getAllUser();
    return res.render('displayCRUD.ejs', {
        datalist: data
    });
}

let postCRUD = async (req, res) => {
    let message = await CRUDService.createNewUser(req.body);
    console.log(message);
    return res.send('post crud from server');
}

let editCRUD = async (req, res) => {
    let userId = req.query.id;
    if(userId){
        let userData = await CRUDService.getUserInfoById(userId);

        return res.render('users/editUser.ejs', {
            data: userData
        });
    } else {
        return res.send('not found id');
    }
}

let putCRUD = async (req, res) => {
    let data = req.body;
    let data1 = await CRUDService.updateUser(data);

    return res.render('users/findAllUser.ejs', {
        datalist: data1
    })
}

let deleteCRUD = async (req, res) => {
    let id = req.query.id;

    if(id){
        await CRUDService.deleteUserById(id);
        return res.send('Delete!!!!!!');
    } else {
        return res.send('Not found User!')
    }
}

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getCRUD: getCRUD,
    postCRUD: postCRUD,
    findAllCRUD: findAllCRUD,
    editCRUD: editCRUD,
    putCRUD: putCRUD,
    deleteCRUD: deleteCRUD
}