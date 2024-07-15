const Product = require("../../models/product.model");

const systemConfig = require("../../config/system");
//[GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const system = require("../../config/system");
//[GET] /admin/products
module.exports.index = async (req, res) => { 
    //filterStatus
    const filterStatus = filterStatusHelper(req.query);
    let find = {
      deleted: false
    };
    if (req.query.status){
        find.status = req.query.status;
    }
    const objectSearch = searchHelper(req.query);
    let keyword = "";
    if (objectSearch.regex){
        find.title = objectSearch.regex;
    }
    // Pagination
    const countProducts = await Product.countDocuments(find); //tat ca nhung doan truy van vao databse thif phair dungf await

    let objectPagination = paginationHelper(
      {
        currentPage: 1,
        limitItems: 4
      },
        req.query,
        countProducts
      );
    
    // End Pagination
    const products = await Product.find(find)
                                  .sort({ position: "desc" })
                                  .limit(objectPagination.limitItems)
                                  .skip(objectPagination.skip);
    res.render("admin/pages/products/index.pug", {
        pageTitle: "List of items",
        products: products,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
      });
}
//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async(req,res) => {
  // console.log(req.params);
  const status = req.params.status;
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { status: status });
  req.flash('success', 'Status changed successfully');
  res.redirect("back");
}
//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
  // console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Update ${ids.length} products successfully`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Update ${ids.length} products successfully`);
      break;
    case "delete-all":
      await Product.updateMany({ _id: { $in: ids }}, 
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Delete ${ids.length} products successfully`);
      break;
    case "change-position":
      // console.log(ids);
      for (const item of ids){
        let[id, position] = item.split(", ");
        position = parseInt(position);
        // console.log(id);
        // console.log(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;        
  }
  res.redirect("back");
}
//[DELETE] /admin/products/delete/:id
module.exports.deleteItem = async(req,res) => {
  const id = req.params.id;
  await Product.updateOne({ _id: id }, { 
    deleted: true,
    deletedAt: new Date() 
  });
  req.flash("success", "Delete successfully!");
  res.redirect("back");
}
//[GET] /admin/products/create
module.exports.create = async(req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Add new product",
  });
}
//[POST] /admin/products/create
module.exports.createPost = async(req, res) => {
  
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);

  if(req.body.position == ""){
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else{
    req.body.position = parseInt(req.body.position);
  }
  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  // console.log(req.body);
  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async(req, res) => {
  // console.log(req.params.id);
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);
    // console.log(product);
    res.render("admin/pages/products/edit", {
      pageTitle: "Edit the product",
      product: product
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }  
}

module.exports.editPatch = async(req, res) => {
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if(req.file){
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  
  try{
    await Product.updateOne({ _id: req.params.id }, req.body);
    req.flash("success", "Update successfully");
  } catch(error){
    req.flash("error", `${error}`);
    
    // req.flash("error", "Cannot update");
  }

  res.redirect("back");
}

module.exports.detail = async(req, res) => {
  // console.log(req.params.id);
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);
    // console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }  
}