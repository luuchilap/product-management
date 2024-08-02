
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