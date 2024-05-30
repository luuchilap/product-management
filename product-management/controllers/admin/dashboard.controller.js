module.exports.dashboard = (req, res) => { //ghi index de biet trang chu
    res.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Trang tong quan"
      });
}