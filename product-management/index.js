const express = require("express");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require("dotenv").config();
const database = require("./config/database.js")

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js"); //route client


database.connect();

const app = express();
const port = process.env.PORT;

app.use(methodOverride("_method"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

//flash
app.use(cookieParser('keyboard_cat'));
app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

//router -> controller -> model -> controller => view
//App local variables, cú pháp app.locals dùng để khai báo
app.locals.prefixAdmin = systemConfig.prefixAdmin;
// console.log(__dirname);
app.use(express.static(`${__dirname}/public`));
//Routes
routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`App listening on prt ${port}`);
});