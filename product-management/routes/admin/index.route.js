const systemConfig = require("../../config/system")

const dashboardRoutes = require("./dashboard.route.js");

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + '/dashboard', dashboardRoutes); //luon luon them /admin cho trang admin, tranh truong hop trung voi client
}