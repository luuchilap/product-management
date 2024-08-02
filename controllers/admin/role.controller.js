const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");

//[GET] /admin/roles    --->Ghi chu cho controller
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    const records = await Role.find(find);
    res.render("admin/pages/roles/index.pug", {
        pageTitle: "Permisson",
        records: records,
      });
}
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Permisson",
    });
};

//[POST] /admin/roles/create
module.exports.createPost = async(req, res) => {
    const record = new Role(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

module.exports.edit = async (req, res) => {
    try{
      const id = req.params.id;
      const data = await Role.findOne({
        _id: id,
        deleted: false
      });
      res.render("admin/pages/roles/edit", {
        pageTitle: "Edit category",
        data: data,
      });
    } catch (error){
      res.redirect(`${systemConfig.prefixAdmin}/edit`);
    }
  };

module.exports.editPatch = async (req, res) => {
    try{
        await Role.updateOne({ _id: req.params.id }, req.body);
        req.flash("success", "Update successfully");
      } catch(error){
        req.flash("error", `${error}`);
      }
    
      res.redirect("back");
}
//[GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Permission Delegation",
    records: records,
  });
}
//[PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions); //anything that sent via form => req.body
  for (const item of permissions){
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
  }
  req.flash("success", "Update successfully");
  res.redirect("back");
};

module.exports.detail = async(req, res) => {
  try{
    const find = {
      deleted: false,
      _id: req.params.id
    }
    const role = await Role.findOne(find);
    res.render(`admin/pages/roles/detail/`, {
      pageTitle: role.title,
      data: role
    });
  } catch (error){
    res.redirect(`${systemConfig.prefixAdmin}/role`);
  }  
  // res.send("Ok");
}