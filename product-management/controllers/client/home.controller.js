module.exports.index = (req, res) => { //ghi index de biet trang chu
    res.render("client/pages/home/index.pug", {
      pageTitle: "Trang chu"
    });
  }