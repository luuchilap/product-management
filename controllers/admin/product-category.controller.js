const ProductCategory = require("../../models/product-category.model");
const systemConfig = require("../../config/system");
const createTreeHelper = require("../../helpers/createTree");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");

module.exports.index = async (req, res) => { 
  //filterStatus
  let find = {
    deleted: false
  };
  // Pagination
  const countProductCategory = await ProductCategory.countDocuments(find); //tat ca nhung doan truy van vao databse thif phair dungf await

  let objectPagination = paginationHelper(
    {
      currentPage: 1,
      limitItems: 4
    },
      req.query,
      countProductCategory
    );
    
  // End Pagination
  const productCategory = await ProductCategory.find(find)
                                        .limit(objectPagination.limitItems)
                                        .skip(objectPagination.skip);
    res.render("admin/pages/product-category/index.pug", {
      pageTitle: "List of items",
      records: productCategory,
      pagination: objectPagination
    });
}

//[PATCH] /admin/product-category/change-status/:status/:id
module.exports.changeStatus = async(req,res) => {
  const status = req.params.status;
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { status: status });
  req.flash('success', 'Status changed successfully');
  res.redirect("back");
}

//[GET] /admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/product-category/create.pug", {
    pageTitle: "Create category",
    records: newRecords
  });
};
//[POST] /admin/product-category/create
module.exports.createPost = async(req, res) => {
  // const permissions = res.locals.role.permissions;
  // if (permissions.includes("products-category_create")){
  //   console.log("Co quyen");
  // } else{
  //   res.send("403");
  //   return;
  // }
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

//[GET] /admin/product-category/detail
module.exports.detail = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const productCategory = await ProductCategory.findOne(find);
    res.render("admin/pages/product-category/detail", {
      pageTitle: productCategory.title,
      productCategory: productCategory
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/product-category`);
  }  
}

//[GET] /admin/product-category/edit
module.exports.edit = async (req, res) => {
  try{
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
    const records = await ProductCategory.find({
      deleted: false
    });
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/product-category/edit", {
      pageTitle: "Edit category",
      data: data,
      records: newRecords
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
  }
  
};

module.exports.editPatch = async(req, res) => {
  try{
    await ProductCategory.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Update successfully");
  } catch(error){
    req.flash("error", `${error}`);
  }

  res.redirect("back");
};

module.exports.deleteCategory = async(req,res) => {
  const id = req.params.id;
  await ProductCategory.updateOne({ _id: id }, { 
    deleted: true,
    deletedAt: new Date() 
  });
  req.flash("success", "Delete successfully!");
  res.redirect("back");
}