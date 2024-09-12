//[GET] /admin/my-account
const Account = require("../../models/account.model.js");
const md5 = require("md5");

module.exports.index = async(req, res) => {
    res.render("admin/pages/my-account/index", {
        pageTitle: "Information", 
        //khong can tra ra data cho view, vi bien user là biến global rồi
    })
};

//[GET] /admin/my-account/edit
module.exports.edit = async(req, res) => {
    res.render("admin/pages/my-account/edit", {
        pageTitle: "Edit personal information",
    });
}
//[PATCH] /admin/my-account/edit
module.exports.editPatch = async(req, res) => {
    const id = res.locals.user.id;
    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });
    if (emailExist){
        req.flash("error", `This email ${req.body.email} is already used`);
    } else{
        if (req.body.password){
            req.body.password = md5(req.body.password);
        } else{
            delete req.body.password;
        }
        await Account.updateOne({ _id: id }, req.body);
        req.flash("success", "Update successfully");
    }
    res.redirect("back");
}