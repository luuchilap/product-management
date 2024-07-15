//[GET] /admin/dashboard    --->Ghi chu cho controller
module.exports.dashboard = (req, res) => { 
    res.render("admin/pages/dashboard/index.pug", {
        pageTitle: "Overview"
      });
}