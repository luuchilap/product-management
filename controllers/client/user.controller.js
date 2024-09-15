
const User = require("../../models/user.model");
const ForgotPassword = require("../../models/forgot-password.model");

const md5 = require("md5");

const generateHelper = require("../../helpers/generate");
//[GET] /user/register
module.exports.register = async(req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Dang ki tai khoan",
    });
};

//[POST] /user/register
module.exports.registerPost = async(req, res) => {
    console.log(req.body);
    const existEmail = await User.findOne({
        email: req.body.email
    });
    if(existEmail) {
        req.flash("error", "This email has been used by another account");
        res.redirect("back");
        return;
    }
    req.body.password = md5(req.body.password);

    const user = new User(req.body);
    await user.save();
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

//[GET] /user/login
module.exports.login = async(req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Dang nhap tai khoan",
    });
};

//[POST] /user/login
module.exports.loginPost = async(req, res) => {
    console.log(req.body);
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({
        email:email,
        deleted: false
    });
    
    if(!user) {
        req.flash("error", "Invalid email");
        res.redirect("back");
        return;
    }

    if(md5(password) !== user.password) {
        req.flash("error", "Invalid password");
        res.redirect("back");
        return;
    }

    if(user.status === "inactive") {
        req.flash("error", "Inactive account");
        res.redirect("back");
        return;
    }
    res.cookie("tokenUser", user.tokenUser);

    res.redirect("/");
};

//[GET] /user/logout
module.exports.logout = async(req, res) => {
    res.clearCookie("tokenUser");
    res.redirect("/");
}

//[GET] /user/password/forgot
module.exports.forgotPassword = async(req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lay lai mat khau",
    })
}

//[Post] /user/password/forgot
module.exports.forgotPasswordPost = async(req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false,
    });

    if(!user){
        req.flash("error", "Invalid email");
        res.redirect("back");
        return;
    }

    const otp = generateHelper.generalRandomNumber(8);
    //Luu thong tin vao database
    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: Date.now()
    };

    const forgotPassword = new ForgotPassword(objectForgotPassword);

    await forgotPassword.save();

    //If the email is valid, send OTP messages to E-mail
    res.redirect(`/user/password/otp?email=${email}`); // "/ = view"

}

// [GET] /user/password/otp
module.exports.otpPassword = async(req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhap ma OTP",
        email: email,
    });
}