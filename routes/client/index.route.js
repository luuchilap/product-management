
const productRoutes = require("./product.route.js");
const homeRoutes = require("./home.route.js");

module.exports = (app) => {
    app.use('/', homeRoutes);
    app.use('/products', productRoutes); //bởi vì ở product.route.js đã dùng get rồi, qua index.route.js chỉ cần dùng use thôi
    //định nghĩa thêm get nữa thì vẫn được, nhưng mà thồiii, làm vậy đọc code sẽ khó hiểu hơn
}