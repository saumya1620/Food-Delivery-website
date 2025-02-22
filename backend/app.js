const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRouter = require("./routes/user.router");
const dishRouter = require("./routes/dish.router");
const foodCategoryRouter = require("./routes/food.category.router");
const orderRouter = require("./routes/order.router");
// const swaggerRouter = require("./routes/swagger.router");
const app = express();

//middleware
app.use(cors());
app.use("/public", express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(userRouter);
app.use(dishRouter);
app.use(foodCategoryRouter);
app.use(orderRouter);
// app.use(swaggerRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
