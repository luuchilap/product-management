const express = require('express');
const multer = require("multer");
const upload = multer();

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const controller = require('../../controllers/admin/product-category.controller.js');
const validate = require("../../validates/admin/product-category.validate");
// C:\Users\ADMIN\product-management-ver2\middlewares
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost);

router.get("/detail/:id", controller.detail);

router.get("/edit/:id", controller.edit);
router.patch(
            "/edit/:id",
            upload.single('thumbnail'),
            uploadCloud.upload,
            validate.createPost,
            controller.editPatch);

router.delete("/delete/:id", controller.deleteCategory);
router.patch('/change-status/:status/:id', controller.changeStatus);
module.exports = router;
