const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");

const app = express();
const Razorpay = require("razorpay");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

app.post("/api/razorpay/pay-successful", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);

    res.send(body);
  } catch (error) {
    console.error(error);
  }
});
app.get("/api/razorpay", async (req, res) => {
  const options = {
    amount: 50 * 100, // amount in the smallest currency unit
    currency: "INR",
    // receipt: "order_rcptid_11",
  };
  const order = await instance.orders.create(options);
  console.log(order);
  res.send({
    success: true,
    order,
    key: process.env.RAZORPAY_API_KEY,
    name: "Bhuwneshwar Mandal ",
    email: "krabi6563@gmail.com",
    contact: "6205085598",
  });
});

app.use(express.static(path.resolve("./frontend/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve("./frontend/dist/index.html"));
});

app.listen(5006, () => {
  console.log("http://localhost:5006");
});