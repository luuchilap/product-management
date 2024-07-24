const express = require('express');
const multer = require("multer");

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });


const upload = multer();
const controller = require('../../controllers/admin/product.controller.js');
const validate = require("../../validates/admin/product.validate");
// C:\Users\ADMIN\product-management-ver2\middlewares
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");
router.get('/', controller.index);
router.patch('/change-status/:status/:id', controller.changeStatus); //:status and :id are called req-params
router.patch("/change-multi", controller.changeMulti);
router.delete("/delete/:id", controller.deleteItem);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

router.get("/edit/:id", controller.edit);
router.patch("/edit/:id",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch);

router.get("/detail/:id", controller.detail);
module.exports = router;
