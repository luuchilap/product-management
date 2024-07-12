//[GET] /products
const Product = require("../../models/product.model");
module.exports.index = async (req,res) => {
    const products = await Product.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" });
    // products.forEach(item => {
    //     item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(2);
    // }); sua truc tiep product => khong toi uu => tao ra mot mang moi
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed(2);
        return item;
    });
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
          slug: req.params.slug,
          status: "active"
        };
        const product = await Product.findOne(find);
        // console.log(product);
        res.render("client/pages/products/detail.pug", {
          pageTitle: product.title,
          product: product
        });
      } catch (error){
        res.redirect(`/products`);
      }  
}