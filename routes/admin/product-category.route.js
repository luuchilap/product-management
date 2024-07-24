const express = require('express');
const multer = require("multer");
const upload = multer();
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js");

const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const controller = require('../../controllers/admin/product-category.controller.js');
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
    upload.single('thumbnail'),
    uploadCloud.upload,
    // validate.createPost,
    controller.createPost);
module.exports = router;
