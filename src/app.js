const express = require("express");
const app = express();

const { connectRedis } = require("./clients/redis");

const cookieParser = require("cookie-parser");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/public", express.static("uploads"));

const authRouter = require("./routes/authRoute");
// const uploadsRouter = require("./routes/uploads");
const errorHandler = require("./middleware/errorHandler");

// sidebar
const categoryRouter = require("./routes/categoryRoute");
const customerRouter = require("./routes/customerRoute");
const productRouter = require("./routes/productRoute");
const offerRouter = require("./routes/offerRoute");
// const ordersRouter = require("./routes/orders");
// const reviewsRouter = require("./routes/reviews");
// const paymentRouter = require("./routes/createOrder");
const notFoundRoute = require("./routes/notFoundRoute");
// const sendEmail = require("./routes/sendEmail");
// const summaryRouter = require("./routes/summary");

// app.use("/", authRouter);
// app.use("/uploads", uploadsRouter);

app.use("/auth", authRouter);
app.use("/categories", categoryRouter);
// app.use("/create-order", paymentRouter);
app.use("/customers", customerRouter);
app.use("/products", productRouter);
app.use("/offers", offerRouter);
// app.use("/orders", ordersRouter);
// app.use("/reviews", reviewsRouter);
// app.use("/get-summary", summaryRouter);

// app.use("/send-email", sendEmail);
app.use(notFoundRoute);
app.use(errorHandler);

module.exports = app;
