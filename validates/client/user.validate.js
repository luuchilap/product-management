module.exports.registerPost = (req, res, next) => {
    if(!req.body.fullName){
        req.flash("error", "Please enter your full name");
        res.redirect("back");
        return;
    }

    if(!req.body.email){
        req.flash("error", "Please enter your email");
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", "Please enter your password");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.loginPost = (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "Please enter your email");
        res.redirect("back");
        return;
    }

    if(!req.body.password){
        req.flash("error", "Please enter your password");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.forgotPasswordPost = (req, res, next) => {
    if(!req.body.email){
        req.flash("error", "Please enter your email");
        res.redirect("back");
        return;
    }
    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if(!req.body.password){
        req.flash("error", "Please enter the password");
        res.redirect("back");
        return;
    }
    if(!req.body.confirmPassword){
        req.flash("error", "Please confirm your password");
        res.redirect("back");
        return;
    }
    if(req.body.password != req.body.confirmPassword){
        req.flash("error", "Password fails to confirm");
        res.redirect("back");
        return;
    }
    next();
}
