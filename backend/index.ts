const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const passport = require("passport");
const expressSession = require("express-session");
const { connectMongoose, User } = require("./database");
const { InitializingPassport, isAuthenticated } = require("./PassportConfig");

const app = express();
const Razorpay = require("razorpay");
require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(
  expressSession({
    secret: "Ubuntu namaste 🙏 ",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});

connectMongoose();

InitializingPassport(passport);

app.get("/", async (req, res) => {
  res.render("index");
});
app.post("/api/razorpay/pay-successful", async (req, res) => {
  try {
    const body = req.body;
    console.log(body);

    //https://github.com/razorpay/razorpay-node */

    const crypto = require("crypto");

    const expectedSignature = crypto
      .createHmac("sha256", process.env.SECRET)
      .update(JSON.stringify(body))
      .digest("hex");
    const razorpay_signature = req.headers["x-razorpay-signature"];
    console.log("sig received ", razorpay_signature);
    console.log("sig generated ", expectedSignature);

    const signatureIsValid = expectedSignature === razorpay_signature;
    if (signatureIsValid) {
      console.log("payment captured ");
      console.log(JSON.stringify(body));
      console.log(body.payload.payment.entity.id);
      console.log(body.payload.payment.entity.order_id);
      //save this id on database
    } else console.log("signature is invalid ");

    res.send({ status: "ok" });
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
app.get("/register", async (req, res) => {
  res.render("register");
});
app.get("/login", async (req, res) => {
  res.render("login");
});
app.get("/logout", async (req, res) => {
  req.logout();
  res.send("Logged out");
});
app.get("/profile", isAuthenticated, async (req, res) => {
  res.send(req.user);
});
app.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/",
  }),
  async (req, res) => {}
);
app.post("/register", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) return res.status(400).send("User Already Exist");

  const newUser = await User.create(req.body);
  console.log(newUser);
  res.status(201).send(newUser);
});

app.use(express.static(path.resolve("./frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve("./frontend/dist/index.html"));
});

app.listen(5006, () => {
  console.log("http://localhost:5006");
});
