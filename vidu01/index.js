const express = require('express')
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/products-test');
const Product = mongoose.model('Product', { 
    title: String,
    price: Number,
    thumbnail: String
 });
const app = express()
const port = 3000
app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static("public"));
app.get('/', (req, res) => {
    res.render('index', { titlePage: 'Hey', message: 'Hello there!' })
  });

app.get('/products', async (req,res) => {
    const products = await Product.find({});
    console.log(products);
    res.render("product.pug", {
        titlePage: "Danh sach san pham",
        products: products
    })
})

app.get("/contact", (req, res) => {
    res.render("contact", {
        titlePage: "Trang lien he",
        message: "Xin chao cac ban",
    })
})

app.listen(port, () => {
    console.log(`App listening on prt ${port}`);
});