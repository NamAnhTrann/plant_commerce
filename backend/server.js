const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const ProductRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const cartRouter = require("./router/cartRouter");
const contactRouter = require("./router/contactRouter");
const orderRouter = require("./router/orderRouter.js");
const paymentRouter = require("./router/paymentRouter.js");
const orderItemController = require("./router/orderItemController.js");
const verifyFirebaseToken = require("./router/verifyTokenRouter");

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:4200",
  "https://bloombox-ukg3s9vm1-namanhtranns-projects.vercel.app",
  "https://bloombox-ukg3s9vm1-namanhtranns-projects.vercel.app/#/",
  "https://bloombox-three.vercel.app/#/",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: "GET, POST, PUT, DELETE",
    credential: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);

app.use(ProductRouter);
app.use(userRouter);
app.use(cartRouter);
app.use(verifyFirebaseToken);
app.use(contactRouter);
app.use(orderRouter);
app.use(orderItemController);
app.use(paymentRouter);

const db_url = process.env.MONGO_DB_URL;
const port_no = process.env.PORT_NO;

app.listen(port_no, function (err) {
  if (!err) {
    console.log(`listens on ${port_no}`);
  } else {
    console.log("Error", err);
  }
});

app.get("/", function (req, res) {
  res.send(`backend is running `);
});

async function connectDB() {
  try {
    await mongoose.connect(db_url);
    console.log(`Conneted to the database ${db_url}`);
  } catch (err) {
    console.log("Connection Error");
  }
}

connectDB();
app.get("/", (req, res) => {
  res.send(" Backend is Running!");
});
