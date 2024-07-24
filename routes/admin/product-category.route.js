const express = require('express');
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const controller = require('../../controllers/admin/product-category.controller.js');
router.get("/", controller.index);
router.get("/create", controller.create);

module.exports = router;
