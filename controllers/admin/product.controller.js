const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

//[GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus.js");
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const createTreeHelper = require("../../helpers/createTree");
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
      
      //Sort
      let sort = {};
      if (req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
      } else {
        sort.position = "desc";
      }
      //End sort
    
    // End Pagination
    const products = await Product.find(find)
                                  .sort(sort)
                                  .limit(objectPagination.limitItems)
                                  .skip(objectPagination.skip);
    for (const product of products){
      //Creator information
      const user = await Account.findOne({
        _id: product.createdBy.account_id
      });
      if (user){
        product.accountFullName = user.fullName;
      }
      //Latest updater
      console.log(product.updatedBy[-1]);
      const updatedBy = product.updatedBy.slice(-1)[0];
      if (updatedBy){
        const userUpdated = await Account.findOne({
          _id: updatedBy.account_id
        });
        updatedBy.accountFullName = userUpdated.fullName;
      }
    }

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

  const updatedBy = {
    account_id: res.locals.user.id,
    updateAt: new Date()
  }

  await Product.updateOne({ _id: id }, { 
    status: status,
    $push: { updatedBy: updatedBy }
   });
  req.flash('success', 'Status changed successfully');
  res.redirect("back");
}

//[PATCH] /admin/products/change-multi
module.exports.changeMulti = async(req, res) => {
  // console.log(req.body);
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updateAt: new Date()
  }

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "active",
        $push: { updatedBy: updatedBy }
       });
      req.flash("success", `Update ${ids.length} products successfully`);
      break;
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { 
        status: "inactive",
        $push: { updatedBy: updatedBy }
      });
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
        await Product.updateOne({ _id: id }, { 
          position: position,
          $push: { updatedBy: updatedBy }
         });
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
    // 
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    }
  });
  req.flash("success", "Delete successfully!");
  res.redirect("back");
}

//[GET] /admin/products/create
module.exports.create = async(req, res) => {
  console.log(res.locals.user);
  let find = {
    deleted: false
  };
  const category = await ProductCategory.find(find);
  const newCategory = await createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Add new product",
    category: newCategory,
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

  req.body.createdBy = {
    account_id: res.locals.user.id
  };

  const product = new Product(req.body);
  await product.save();

  res.redirect(`${systemConfig.prefixAdmin}/products`);
}

module.exports.edit = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);
    const category = await ProductCategory.find({deleted: false});
    const newCategory = await createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Edit the product",
      product: product,
      category: newCategory
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
  try{
    const updatedBy = {
      account_id: res.locals.user.id,
      updateAt: new Date()
    }
    await Product.updateOne({ _id: req.params.id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });
    req.flash("success", "Update successfully");
  } catch(error){
    req.flash("error", `${error}`);
  }

  res.redirect("back");
}

module.exports.detail = async(req, res) => {
  // for (const product of products){
  //   const user = await Account.findOne({
  //     _id: product.createdBy.account_id
  //   });
  //   if (user){
  //     product.accountFullName = user.fullName;
  //   }
  // }
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const product = await Product.findOne(find);
    // console.log(product.createdBy.account_id);
    const p_category = await ProductCategory.findOne({
      _id: product.product_category_id
    });
    if (p_category){
      product.product_category_id = p_category.title
    }
    // if (user){
    //   product.accountFullName = user.fullName;
    // }
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }  
}