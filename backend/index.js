var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var ejs = require("ejs");
var passport = require("passport");
var expressSession = require("express-session");
var _a = require("./database"), connectMongoose = _a.connectMongoose, User = _a.User;
var _b = require("./PassportConfig"), InitializingPassport = _b.InitializingPassport, isAuthenticated = _b.isAuthenticated;
var app = express();
var Razorpay = require("razorpay");
require("dotenv").config();
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({
    secret: "Ubuntu namaste 🙏 ",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.set("view engine", "ejs");
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});
connectMongoose();
InitializingPassport(passport);
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("index");
        return [2 /*return*/];
    });
}); });
app.post("/api/razorpay/pay-successful", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var body, crypto, expectedSignature, razorpay_signature, signatureIsValid;
    return __generator(this, function (_a) {
        try {
            body = req.body;
            console.log(body);
            crypto = require("crypto");
            expectedSignature = crypto
                .createHmac("sha256", process.env.SECRET)
                .update(JSON.stringify(body))
                .digest("hex");
            razorpay_signature = req.headers["x-razorpay-signature"];
            console.log("sig received ", razorpay_signature);
            console.log("sig generated ", expectedSignature);
            signatureIsValid = expectedSignature === razorpay_signature;
            if (signatureIsValid) {
                console.log("payment captured ");
                console.log(JSON.stringify(body));
                console.log(body.payload.payment.entity.id);
                console.log(body.payload.payment.entity.order_id);
                //save this id on database
            }
            else
                console.log("signature is invalid ");
            res.send({ status: "ok" });
        }
        catch (error) {
            console.error(error);
        }
        return [2 /*return*/];
    });
}); });
app.get("/api/razorpay", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var options, order;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                options = {
                    amount: 50 * 100,
                    currency: "INR",
                    // receipt: "order_rcptid_11",
                };
                return [4 /*yield*/, instance.orders.create(options)];
            case 1:
                order = _a.sent();
                console.log(order);
                res.send({
                    success: true,
                    order: order,
                    key: process.env.RAZORPAY_API_KEY,
                    name: "Bhuwneshwar Mandal ",
                    email: "krabi6563@gmail.com",
                    contact: "6205085598",
                });
                return [2 /*return*/];
        }
    });
}); });
app.get("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("register");
        return [2 /*return*/];
    });
}); });
app.get("/login", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("login");
        return [2 /*return*/];
    });
}); });
app.get("/logout", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        req.logout();
        res.send("Logged out");
        return [2 /*return*/];
    });
}); });
app.get("/profile", isAuthenticated, function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.send(req.user);
        return [2 /*return*/];
    });
}); });
app.post("/login", passport.authenticate("local", {
    failureRedirect: "/register",
    successRedirect: "/",
}), function (req, res) { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    return [2 /*return*/];
}); }); });
app.post("/register", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, newUser;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, User.findOne({ username: req.body.username })];
            case 1:
                user = _a.sent();
                if (user)
                    return [2 /*return*/, res.status(400).send("User Already Exist")];
                return [4 /*yield*/, User.create(req.body)];
            case 2:
                newUser = _a.sent();
                console.log(newUser);
                res.status(201).send(newUser);
                return [2 /*return*/];
        }
    });
}); });
app.use(express.static(path.resolve("./frontend/dist")));
app.get("*", function (req, res) {
    res.sendFile(path.resolve("./frontend/dist/index.html"));
});
app.listen(5006, function () {
    console.log("http://localhost:5006");
});
