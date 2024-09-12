//[GET] /products
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

const productsHelper = require("../../helpers/products.js");
const productsCategoryHelper = require("../../helpers/products-category.js");

module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    // products.forEach(item => {
    //     item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(2);
    // }); sua truc tiep product => khong toi uu => tao ra mot mang moi
    
    const newProducts = productsHelper.priceNewProducts(products);
    // console.log(newProducts);
    res.render("client/pages/products/index.pug",{
        pageTitle: "Day la trang chu",
        products: newProducts
    });
}

module.exports.detail = async (req,res) => {
    
    try{
        const find = {
          deleted: false,
          slug: req.params.slugProduct,
          status: "active"
        };
        const product = await Product.findOne(find);

        if(product.product_category_id){
          const category = await ProductCategory.findOne({
            _id: product.product_category_id,
            status: "active",
            deleted: false
          });
          product.category = category;
        }
        product.priceNew = productsHelper.priceNewProduct(product);
        // console.log(product);
        res.render("client/pages/products/detail", {
          pageTitle: product.title,
          product: product
        });
      } catch (error){
        res.redirect(`/products`);
      }  
}
module.exports.category = async(req, res) => {
  // console.log(req.params.slugCategory);

  const category = await ProductCategory.findOne({
    slug: req.params.slugCategory,
    deleted: false
  });

  const listSubCategory = await productsCategoryHelper.getSubCategory(category.id);
  const listSubCategoryId = listSubCategory.map(item => item.id);


  const products = await Product.find({
    product_category_id: { $in: [category.id, ...listSubCategoryId]},
    deleted: false
  }).sort({ position: "desc" });

  const newProducts = productsHelper.priceNewProducts(products);


  res.render("client/pages/products/index", {
      pageTitle: category.title,
      products: newProducts,
    });
}