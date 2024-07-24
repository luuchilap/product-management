const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => { 
    res.render("admin/pages/product-category/index.pug", {
        pageTitle: "Categories",
      });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create.pug", {
    pageTitle: "Create category",
  });
};
module.exports.createPost = async(req, res) => {
  const count = await ProductCategory.countDocuments();
    if(req.body.position == ""){
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else{
    req.body.position = parseInt(req.body.position);
  }
  // if(req.file){
  //   req.body.thumbnail = `/uploads/${req.file.filename}`;
  // }
  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  // res.send(record);
}