const Account = require("../../models/account.model.js");
const md5 = require("md5");
const systemConfig = require("../../config/system");
const Role = require("../../models/role.model.js");
//[GET] /admin/accounts
module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };
    // const records = await Account.find(find).select("-password -token");
    const records = await Account.find(find);

    try{
            for (const record of records) {
                const role = await Role.findOne({
                    _id: record.role_id,
                    deleted: false
                });
                record.role_id = role.title;
            }
    } catch(error){
        res.redirect("back");
        // res.send(error);
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "List of accounts",
        records: records,
      });
}

//[GET] /admin/accounts/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    });

    res.render("admin/pages/accounts/create", {
        pageTitle: "List of accounts",
        roles: roles
    });
};

//[POST] /admin/accounts/create
module.exports.createPost = async(req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    
    if (emailExist){
        req.flash("error", `This email ${req.body.email} is already used`);
        res.redirect("back");
    } else{
        req.body.password = md5(req.body.password);
        const record = new Account(req.body);
        
        await record.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
    
};

module.exports.edit = async(req,res) => {
    let find = {
        _id: req.params.id,
        deleted: false,
    };
    try{
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false,
        });
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Edit the account",
            data: data,
            roles: roles,
        });
    } catch (error){
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
};

module.exports.editPatch = async(req, res) => {
    const id = req.params.id;
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
};

module.exports.detail = async (req, res) => {
    const account = await Account.findOne({
        deleted: false,
    });

    res.render("admin/pages/accounts/detail", {
        account: account
    });
};