const Account = require("../../models/account.model.js");
const md5 = require("md5");
const systemConfig = require("../../config/system");

//[GET] /admin/auth/login    --->Ghi chu cho controller
module.exports.login = (req, res) => { 
    console.log(req.cookies.token);
    if(req.cookies.token){
      res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
      res.render("admin/pages/auth/login.pug", {
        pageTitle: "Sign in"
      });
    }
    
}
//[POST] /admin/auth/login
module.exports.loginPost = async(req, res) => { 
  const email = req.body.email;
  const password = req.body.password;
  // const{ email, password } = req.body;
  const user = await Account.findOne({
    email: email,
    deleted: false
  });
  if(!user){
    req.flash("error", "Email is not valid");
    res.redirect("back");
    return;
  }
  if(md5(password) != user.password){
    req.flash("error", "Wrong password");
    res.redirect("back");
    return;
  }
  if(user.status == "inactive"){
    req.flash("error", "Inactive account");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token);
  res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
} 
//[GET] /admin/auth/detail
module.exports.logout = (req, res) => { 
  res.clearCookie("token");
  res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}
