const express = require('express');
require("dotenv").config();
const database = require("./config/database.js")

const systemConfig = require("./config/system");

const routeAdmin = require("./routes/admin/index.route.js");
const route = require("./routes/client/index.route.js"); //route client


database.connect();

const app = express();
const port = process.env.PORT;



app.set('views', './views');
app.set('view engine', 'pug');

//router -> controller -> model -> controller => view
//App local variables, cú pháp app.locals dùng để khai báo
app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use(express.static("public"));
//Routes
routeAdmin(app);
route(app);


app.listen(port, () => {
    console.log(`App listening on prt ${port}`);
});