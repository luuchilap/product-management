const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware");


const productRoutes = require("./product.route.js");
const homeRoutes = require("./home.route.js");
const searchRoutes = require("./search.route.js");
const cartRoutes = require("./cart.route.js");
const checkoutRoutes = require("./checkout.route.js");
const userRoutes = require("./user.route.js");


module.exports = (app) => {
    app.use(categoryMiddleware.category);
    app.use(cartMiddleware.cartId);
    app.use(userMiddleware.infoUSer);
    app.use('/', homeRoutes);
    
    app.use('/products', productRoutes); //bởi vì ở product.route.js đã dùng get rồi, qua index.route.js chỉ cần dùng use thôi
    //định nghĩa thêm get nữa thì vẫn được, nhưng mà thồiii, làm vậy đọc code sẽ khó hiểu hơn
    
    app.use('/search', searchRoutes);
    app.use('/cart', cartRoutes);
    app.use('/checkout', checkoutRoutes);
    app.use('/user', userRoutes);
}