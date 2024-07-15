//[GET] /
module.exports.index = (req, res) => { //ghi index de biet trang chu
    res.render("client/pages/home/index.pug", { //khi dùng render, mặc định đã ở sẵn trong folder view,
      //ngay ban đầu, trong file index.js (file tổng) đã cấu hình như vậy rồi (xem bài 18, 1:47:40)
      pageTitle: "Trang chu"
    });
  }