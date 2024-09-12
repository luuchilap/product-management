//[GET] /

const Product = require("../../models/product.model");

const productsHelper = require("../../helpers/products.js");

module.exports.index = async(req, res) => { //ghi index de biet trang chu
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active"
  }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  const productsNew = await Product.find({
    deleted: false,
    status: "active"
  }).sort({ position: "desc" }).limit(6);

  const newProductsNew = productsHelper.priceNewProducts(productsNew);


  res.render("client/pages/home/index.pug", { //khi dùng render, mặc định đã ở sẵn trong folder view,
    //ngay ban đầu, trong file index.js (file tổng) đã cấu hình như vậy rồi (xem bài 18, 1:47:40)
    pageTitle: "Trang chu",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew
  });
}