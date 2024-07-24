module.exports.index = async (req, res) => { 
    res.render("admin/pages/product-category/index.pug", {
        pageTitle: "Categories",
      });
};

module.exports.create = async (req, res) => {
  res.render("admin/pages/product-category/create.pug", {
    pageTitle: "Create category",
  });
};
